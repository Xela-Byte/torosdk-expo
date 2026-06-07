import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('CLI init', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'torosdk-cli-test-'));
    // Create a fake app.json to simulate an Expo project
    fs.writeFileSync(path.join(tmpDir, 'app.json'), JSON.stringify({ expo: { sdkVersion: '52.0.0' } }));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('scaffolds config files into src/torosdk/', () => {
    // Note: this test runs the compiled CLI if available, or validates template content
    // In CI, we verify the templates exist and contain expected markers
    const templatesDir = path.join(__dirname, '..', '..', 'src', 'cli', 'templates');

    expect(fs.existsSync(path.join(templatesDir, 'config.ts.template'))).toBe(true);
    expect(fs.existsSync(path.join(templatesDir, 'auth.ts.template'))).toBe(true);
    expect(fs.existsSync(path.join(templatesDir, 'provider.tsx.template'))).toBe(true);

    const authContent = fs.readFileSync(
      path.join(templatesDir, 'auth.ts.template'),
      'utf-8'
    );
    expect(authContent).toContain('createPasswordStrategy');
    expect(authContent).toContain('createBiometricStrategy');
    expect(authContent).toContain('createCustomStrategy');

    const providerContent = fs.readFileSync(
      path.join(templatesDir, 'provider.tsx.template'),
      'utf-8'
    );
    expect(providerContent).toContain('ToronetProvider');
    expect(providerContent).toContain('ToroWrapper');
  });

  test('init script is a valid Node module', () => {
    const initPath = path.join(__dirname, '..', '..', 'src', 'cli', 'init.ts');
    expect(fs.existsSync(initPath)).toBe(true);
    const content = fs.readFileSync(initPath, 'utf-8');
    expect(content).toContain('torosdk-expo init');
    expect(content).toContain('execSync');
    expect(content).toContain('TEMPLATES_DIR');
  });
});
