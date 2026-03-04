
# ExplainIt - Visual AI Tutor

A smart learning companion that explains complex topics with text and AI-generated imagery using the Gemini API.

## How to Deploy to GitHub

### 1. Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g., `explain-it`).
3. Keep it Public or Private and click **Create repository**.

### 2. Push your Code
Run these commands in your local project folder:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/explain-it.git
git push -u origin main
```

### 3. Setup the API Key
Since this app uses the Gemini API, you need to provide your API Key to the GitHub Action so it can bake it into the site during the build process:
1. In your GitHub repository, go to **Settings** > **Secrets and variables** > **Actions**.
2. Click **New repository secret**.
3. Name: `API_KEY`
4. Value: `YOUR_GEMINI_API_KEY_HERE`

### 4. Enable GitHub Pages
1. Go to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. The next time you push code, the "Deploy" workflow (found in `.github/workflows/deploy.yml`) will automatically run and host your site!

## Development
To run this project locally:
1. `npm install`
2. `export API_KEY=your_key_here` (or create a `.env` file)
3. `npm run dev`
