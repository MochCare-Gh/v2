# Welcome to MOCHCare

An intelligent system designed to help midwives, healthcare administrators, and personnel efficiently manage maternal records and healthcare services.

## Project Deployment

**URL**: https://platform.mochcare.com/

---

## Setting Up the Database

This project uses **Supabase** as the backend database. Follow these steps to set up the database:

1. **Create a Supabase Project**:
   - Go to [Supabase](https://supabase.com/) and create a new project.
   - Note down the `Project URL` and `API Key`.

2. **Run Database Migrations**:
   - Navigate to the `src/integrations/supabase/migrations` folder.
   - Apply the SQL migration scripts to your Supabase database using the SQL editor in the Supabase dashboard.

3. **Configure Environment Variables**:
   - Create a `.env` file in the root of your project.
   - Add the following variables:
     ```env
     VITE_SUPABASE_URL=<YOUR_SUPABASE_PROJECT_URL>
     VITE_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
     VITE_SUPABASE_SERVICE_ROLE_KEY=<YOUR_SUPABASE_SERVICE_ROLE_KEY>
     ```

4. **Test the Connection**:
   - Run the project locally and ensure the database is connected properly.

---

## Running the Project

Follow these steps to run the project locally:

1. **Clone the Repository**:
   ```sh
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install Dependencies**:
   ```sh
   npm install
   ```

3. **Start the Development Server**:
   ```sh
   npm run dev
   ```
   - The project will be available at `http://localhost:3000`.

4. **Build for Production**:
   ```sh
   npm run build
   ```

5. **Preview Production Build**:
   ```sh
   npm run preview
   ```

---


## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. 

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

To deploy this project, follow these steps:

1. **Build the Project**:
   - Run the following command to generate the production build:
     ```sh
     npm run build
     ```
   - This will create a `dist` folder containing the optimized production files.

2. **Choose a Hosting Platform**:
   - You can deploy the project using platforms like **Vercel**, **Netlify**, or **AWS Amplify**.

3. **Deploy to Vercel**:
   - Install the Vercel CLI:
     ```sh
     npm install -g vercel
     ```
   - Run the deployment command:
     ```sh
     vercel
     ```
   - Follow the prompts to complete the deployment.

4. **Deploy to Netlify**:
   - Drag and drop the `dist` folder into the Netlify dashboard.
   - Alternatively, use the Netlify CLI:
     ```sh
     npm install -g netlify-cli
     netlify deploy
     ```

5. **Deploy to AWS Amplify**:
   - Connect your GitHub repository to AWS Amplify.
   - Configure the build settings:
     ```yaml
     version: 1
     frontend:
       phases:
         build:
           commands:
             - npm install
             - npm run build
       artifacts:
         baseDirectory: dist
         files:
           - '**/*'
       cache:
         paths:
           - node_modules/**/*
     ```
   - Deploy the application.

6. **Configure Environment Variables**:
   - Add the required environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, etc.) in the hosting platform's settings.

7. **Test the Deployment**:
   - Access the deployed URL and verify that the application works as expected.

8. **Set Up a Custom Domain (Optional)**:
   - If you want to use a custom domain, configure the DNS settings in your hosting platform and link the domain to your deployment.

## Contributing

Thank you for considering contributing to this project! Our user guide can be found here [MOCHCare User Guide](https://mochcare.gitbook.io/product-docs/59ojkfJv1gOmOLD9PiZD/).

## Security Vulnerabilities

If you discover a security vulnerability within this project, please send an e-mail to Jour tech team via [tech@mochcare.com](mailto:tech@mochcare.com). All security vulnerabilities will be promptly addressed.

## Copyright
Ownership by MOCHCARE Limited Company
[www.mochcare.com](https://mochcare.com) <br />
[Document 1](https://github.com/MochCare-Gh/service-provider-portal/blob/main/CERT%20OF%20INCOPORATION.pdf) <br />
[Document 2](https://github.com/MochCare-Gh/service-provider-portal/blob/main/OWNERSHIP%20PROFILE.pdf)

## License

The project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).



