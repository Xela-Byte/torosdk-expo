#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const TEMPLATES_DIR = path.resolve(__dirname, 'templates');
const TARGET_DIR = 'src/torosdk';

function main(): void {
  console.log('\n🔧 torosdk-expo init\n');

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
  } else {
    console.log('✅ Detected Expo project');
  }

  // 2. Determine package manager
  let pm = 'npm';
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) {
    pm = 'yarn';
  } else if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) {
    pm = 'pnpm';
  }

  console.log(`📦 Installing dependencies with ${pm}...`);
  const deps = 'torosdk @tanstack/react-query expo-secure-store expo-local-authentication';
  try {
    execSync(`${pm} install ${deps}`, { cwd, stdio: 'inherit' });
  } catch {
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
    } else {
      // Fallback: templates might be at a different path in development
      const altSrc = path.join(__dirname, '..', '..', 'src', 'cli', 'templates', files[i]);
      if (fs.existsSync(altSrc)) {
        fs.copyFileSync(altSrc, dest);
        console.log(`   Created ${TARGET_DIR}/${destNames[i]}`);
      } else {
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
  console.log('✅ torosdk-expo is ready!');
  console.log('');
  console.log('Next steps:');
  console.log(`  1. Choose an auth strategy in ${TARGET_DIR}/auth.ts`);
  console.log(`  2. Wrap your app with <ToroWrapper> from ${TARGET_DIR}/provider.tsx`);
  console.log('  3. Start building with hooks: useBalance, useTransfer, useWallets...');
  console.log('');
  console.log('Docs: https://github.com/toroforge/torosdk-expo');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main();
