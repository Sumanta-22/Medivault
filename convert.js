import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pagesDir = path.join(__dirname, 'client', 'src', 'pages');
const compDir = path.join(__dirname, 'client', 'src', 'components');

const replaceInFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf-8');

    // 1. Remove Next.js 'use client'
    content = content.replace(/'use client';?\n?/g, '');
    content = content.replace(/"use client";?\n?/g, '');

    // 2. Modify Next.js imports
    content = content.replace(/import Link from 'next\/link';?/g, "import { Link } from 'react-router-dom';");
    
    // next/navigation hooks
    if (content.includes('next/navigation')) {
        let reactRouterImports = [];
        if (content.includes('useRouter')) reactRouterImports.push('useNavigate');
        if (content.includes('usePathname')) reactRouterImports.push('useLocation');
        if (content.includes('useParams')) reactRouterImports.push('useParams');

        content = content.replace(/import {?[^}]*}? from 'next\/navigation';?/, 
            `import { ${reactRouterImports.join(', ')} } from 'react-router-dom';`);

        // Replace hook initializations
        content = content.replace(/const router = useRouter\(\);/g, 'const navigate = useNavigate();');
        content = content.replace(/const pathname = usePathname\(\);/g, 'const location = useLocation();\n    const pathname = location.pathname;');
        // Change router.push to navigate
        content = content.replace(/router\.push\(/g, 'navigate(');
    }

    // 3. Modifying auth
    if (content.includes('next-auth/react')) {
        let imports = [];
        if (content.includes('useSession')) imports.push('useSession');
        if (content.includes('signIn')) imports.push('signIn');
        if (content.includes('signOut')) imports.push('signOut');
        
        content = content.replace(/import {?[^}]*}? from 'next-auth\/react';?/, 
            `import { useAuth } from '@/context/AuthContext';`);

        // Replace useSession initialization
        content = content.replace(/const { data: session } = useSession\(\);/g, 'const { session } = useAuth();');
        content = content.replace(/const { data: session, status } = useSession\(\);/g, "const { session, loading } = useAuth();\n    const status = loading ? 'loading' : session ? 'authenticated' : 'unauthenticated';");
        
        // Remove signIn / signOut raw imports if they were replaced with context usage. Wait, signIn is complex. Let's fix that manually in LoginPage, but fix signOut.
        content = content.replace(/signOut\({ callbackUrl: '\/' }\)/g, "logout(); navigate('/')");
    }

    fs.writeFileSync(filePath, content, 'utf-8');
};

const walkSync = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            walkSync(filepath);
        } else if (filepath.endsWith('.jsx')) {
            replaceInFile(filepath);
        }
    });
};

walkSync(pagesDir);
walkSync(compDir);
console.log('Done converting files');
