# Team Azbow - Local Business Directory



## 🚀 Features

* **Role-Based Authentication:** Secure login for **Business Owners** and **Regular Users**.
* **Owner Dashboard:**
* Create, edit, and manage business profiles.
* View engagement insights (Profile Views, Contact Clicks).
* Upload business logos.
* **Discovery Platform:**
* Search businesses by name or description.
* **Filter** by Category and Location.
* **Sort** results (Newest, Oldest, A-Z, Z-A).
* Pagination for seamless browsing.
* **User Interaction:**
* View detailed business profiles.
* **Contact via WhatsApp** integration.
* **Bookmark** favorite businesses for quick access.

## 🛠️ Tech Stack

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Language:** TypeScript
* **Database:** Prisma ORM with MySQL
* **Styling:** Tailwind CSS
* **Auth:** NextAuth.js
* **State Management:** TanStack Query (React Query)
* **File Storage:** UploadThing
* **Icons:** Lucide React
* **Validation:** Zod + React Hook Form

---

## ⚙️ Getting Started



Follow these instructions to set up the project locally on your machine.

### 1. Prerequisites

Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher)
* [MySQL](https://www.mysql.com/) (Running locally on port 3306)

### 2. Clone the Repository

```bash
git clone <repository-url>
cd team-azbow

```

### 3. Install Dependencies

```bash
npm install
# or
yarn install
# or
bun install
```
### 4. Environment Variable Setup

Create a .env file in the root directory of the project. You can refer to the example below.
```bash
# Database Configuration (MySQL)
DATABASE_URL="mysql://root:password@localhost:3306/azbow_assignment"
DATABASE_HOST="localhost"
DATABASE_USER="root"
DATABASE_PASSWORD="your_database_password"
DATABASE_NAME="azbow_assignment"
DATABASE_PORT=3306

# NextAuth Configuration
NEXTAUTH_SECRET="your_generated_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# UploadThing Configuration (File Uploads)
UPLOADTHING_TOKEN="your_uploadthing_api_token"
```

### 5. Settin up UploadThing(Image Storage)

This project uses UploadThing to store business logos. You must set this up for image uploads to work.

1. Go to UploadThing.com and sign in (you can use GitHub).
2. Click "Create a new app".
3. Give your app a name (e.g., "team-azbow-local") and click Create App.
4. In your app dashboard, go to the "API Keys" tab on the left sidebar.
5. Copy the api key and paste it in the env file

### 6. Database Setup

Synchronize your database schema using Prisma.
# Generate Prisma Client
npx prisma generate

# Push the schema to your database (for prototyping)
npx prisma db push

### 7. Run the Development Server

```bash
npm run dev
```
Open http://localhost:3000 with your browser to see the result.