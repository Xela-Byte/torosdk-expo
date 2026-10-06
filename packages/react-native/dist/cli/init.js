#!/usr/bin/env node
"use strict";
/**
 * CLI entry point for `torosdk-expo init`.
 *
 * @remarks
 * This script bootstraps a torosdk integration into an existing Expo
 * project. It performs five sequential steps:
 *
 * 1. **Detect** the Expo project root via `app.json` or `app.config.*`.
 * 2. **Determine** the package manager (npm, yarn, or pnpm).
 * 3. **Install** the required peer dependencies: `torosdk`,
 *    `@tanstack/react-query`, `expo-secure-store`, and
 *    `expo-local-authentication`.
 * 4. **Scaffold** three starter files into `src/torosdk/`:
 *    `config.ts`, `auth.ts`, and `provider.tsx`.
 * 5. **Append** `TOROSDK_NETWORK=testnet` to `.env.example` if the
 *    variable is not already present.
 *
 * After the script finishes, the developer chooses an auth strategy,
 * wraps their app, and can immediately begin using hooks such as
 * {@link useBalance} and {@link useTransfer}.
 *
 * @example
 * ```bash
 * npx torosdk-expo init
 * ```
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const TEMPLATES_DIR = path.resolve(__dirname, 'templates');
const TARGET_DIR = 'src/torosdk';
/**
 * Run the full initialisation pipeline.
 *
 * Exits with code `1` if dependency installation fails.
 */
function main() {
    console.log('\n🔧 @reactforge/react-native init\n');
    // 1. Detect Expo project
    const cwd = process.cwd();
    const appJsonPath = path.join(cwd, 'app.json');
    const appConfigPath = path.join(cwd, 'app.config.js');
    const appConfigTsPath = path.join(cwd, 'app.config.ts');
    const hasAppJson = fs.existsSync(appJsonPath);
    const hasAppConfig = fs.existsSync(appConfigPath) || fs.existsSync(appConfigTsPath);
    if (!hasAppJson && !hasAppConfig) {
        console.warn('⚠️  No app.json or app.config found. Are you in an Expo project root?');
        console.warn('   Continuing anyway...\n');
    }
    else {
        console.log('✅ Detected Expo project');
    }
    // 2. Determine package manager
    let pm = 'npm';
    if (fs.existsSync(path.join(cwd, 'yarn.lock'))) {
        pm = 'yarn';
    }
    else if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) {
        pm = 'pnpm';
    }
    console.log(`📦 Installing dependencies with ${pm}...`);
    const deps = '@reactforge/react-native @reactforge/sdk-adapter @tanstack/react-query expo-secure-store expo-local-authentication';
    try {
        (0, child_process_1.execSync)(`${pm} install ${deps}`, { cwd, stdio: 'inherit' });
    }
    catch {
        console.error('❌ Failed to install dependencies. Check your network and try again.');
        process.exit(1);
    }
    console.log('✅ Dependencies installed\n');
    // 3. Scaffold files
    const targetPath = path.join(cwd, TARGET_DIR);
    if (fs.existsSync(targetPath)) {
        console.log(`⚠️  ${TARGET_DIR}/ already exists. Files may be overwritten.`);
    }
    fs.mkdirSync(targetPath, { recursive: true });
    const files = ['config.ts.template', 'auth.ts.template', 'provider.tsx.template'];
    const destNames = ['config.ts', 'auth.ts', 'provider.tsx'];
    for (let i = 0; i < files.length; i++) {
        const src = path.join(TEMPLATES_DIR, files[i]);
        const dest = path.join(targetPath, destNames[i]);
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
            console.log(`   Created ${TARGET_DIR}/${destNames[i]}`);
        }
        else {
            // Fallback: templates might be at a different path in development
            const altSrc = path.join(__dirname, '..', '..', 'src', 'cli', 'templates', files[i]);
            if (fs.existsSync(altSrc)) {
                fs.copyFileSync(altSrc, dest);
                console.log(`   Created ${TARGET_DIR}/${destNames[i]}`);
            }
            else {
                console.warn(`⚠️  Could not find template: ${files[i]}`);
            }
        }
    }
    // 4. Append to .env.example
    const envPath = path.join(cwd, '.env.example');
    const envLine = 'TOROSDK_NETWORK=testnet';
    let envContent = '';
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf-8');
    }
    if (!envContent.includes('TOROSDK_NETWORK')) {
        fs.appendFileSync(envPath, envContent.endsWith('\n') ? `${envLine}\n` : `\n${envLine}\n`);
        console.log('   Updated .env.example');
    }
    // 5. Print summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ @reactforge/react-native is ready!');
    console.log('');
    console.log('Next steps:');
    console.log(`  1. Choose an auth strategy in ${TARGET_DIR}/auth.ts`);
    console.log(`  2. Wrap your app with <ToroWrapper> from ${TARGET_DIR}/provider.tsx`);
    console.log('  3. Start building with hooks: useBalance, useTransfer, useWallets...');
    console.log('');
    console.log('Docs: https://github.com/toroforge/reactforge');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}
main();
//# sourceMappingURL=init.js.map