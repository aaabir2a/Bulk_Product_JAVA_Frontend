# Product Upload Frontend

A modern Next.js 15 web application for bulk product uploads with real-time progress tracking and product management.

## Design Decisions

### Technology Choices
- **Next.js 15**: Latest version with App Router for better performance and developer experience
- **TypeScript**: Type safety and better IDE support
- **Tailwind CSS**: Utility-first CSS for rapid, maintainable styling
- **Axios**: Robust HTTP client with interceptors for JWT handling

### UI/UX Design
- **Light Theme**: Clean white background with blue accents for better readability
- **Form-First Approach**: Detailed product input forms for each uploaded file
- **Real-Time Feedback**: Live progress bar showing upload percentage
- **Field Validation**: Clear error messages with field-level highlighting
- **Responsive Design**: Mobile-first approach that works on all screen sizes

### Architecture
- **App Router**: Next.js 15's modern routing system
- **Client Components**: Interactive forms and dynamic UI with React hooks
- **API Client Layer**: Centralized axios instance with JWT interceptors
- **Local Storage**: JWT token persistence for authentication
- **Form State Management**: React useState for managing file uploads and metadata

### User Experience Features
- **Drag & Drop**: Intuitive file upload interface
- **Image Previews**: See uploaded images before submission
- **Batch Processing**: Upload multiple products with individual details
- **Copy to Clipboard**: One-click URL copying with visual feedback
- **Error Handling**: Field-specific validation errors with helpful messages
- **Password Guidance**: Clear requirements displayed for user registration

---

## How to Run

### Prerequisites
- Node.js 18+ (tested with Node 18/20)
- npm or yarn

### Quick Start

1. **Navigate to the project**
   ```bash
   cd product-upload-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file:
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1" > .env.local
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open http://localhost:3000 (or http://localhost:3001 if 3000 is in use)
   - You'll be redirected to login page
   - Register a new account to get started

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker (Optional)

```bash
# Build Docker image
docker build -t product-upload-frontend .

# Run container
docker run -p 3000:3000 product-upload-frontend
```

---

## Using the Application

### 1. Register/Login
- Navigate to `/auth/register` or click "Register here"
- Create account with strong password (uppercase, lowercase, digit, special char)
- Or login if you already have an account

### 2. Upload Products
- Click "Choose Files" or drag and drop images
- Fill in product details for each image:
  - **Product Name** (required)
  - **Price** (required)
  - **Category** (required) - Select from dropdown
  - **SKU** (required) - Auto-generated, can be modified
  - **Brand** (optional)
  - **Stock Quantity** (optional)
  - **Description** (optional)
- Click "Upload X Products" button
- Watch real-time progress bar

### 3. View Products
- Click "View Products" in header
- Browse paginated product gallery
- Click copy icon to copy image URL
- Click "View" to see full-size image
- Click "Edit" for editing (placeholder for now)

---

## Project Structure

```
app/
├── auth/
│   ├── login/page.tsx      # Login page
│   └── register/page.tsx   # Registration page
├── products/page.tsx       # Product gallery with pagination
├── page.tsx                # Home/Upload page
├── layout.tsx              # Root layout
└── globals.css             # Global styles

lib/
├── api-client.ts           # Axios instance with interceptors
└── api.ts                  # API service functions

next.config.ts              # Next.js configuration
tailwind.config.ts          # Tailwind CSS configuration
```

---

## Key Features

✅ **JWT Authentication** - Secure login/register  
✅ **Drag & Drop Upload** - Intuitive file selection  
✅ **Detailed Product Forms** - Complete product information  
✅ **Real-Time Progress** - Percentage-based progress bar  
✅ **Image Previews** - See images before upload  
✅ **Field Validation** - Clear error messages  
✅ **Copy URL** - One-click image URL copying  
✅ **Pagination** - Efficient product browsing  
✅ **Responsive Design** - Works on all devices  
✅ **Password Requirements** - Helpful validation hints  

---

## Environment Variables

Create `.env.local` file with:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

# Optional: Custom port (default is 3000)
PORT=3001
```

---

## API Integration

The frontend connects to the Spring Boot backend:

**Authentication:**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

**Products:**
- `POST /products/bulk-upload` - Upload products with images
- `GET /products` - List all products
- `GET /products/{id}/image` - Get product image

**JWT Token:**
- Stored in localStorage
- Auto-included in requests via axios interceptor
- Auto-logout on 401 responses

---

## Form Validation

### Registration
- **Username**: Required, must be unique
- **Email**: Required, valid email format
- **Password**: Required, must contain:
  - At least 8 characters
  - One uppercase letter (A-Z)
  - One lowercase letter (a-z)
  - One digit (0-9)
  - One special character (!@#$%^&*)

### Product Upload
- **Name**: Required
- **Price**: Required, numeric
- **Category**: Required, dropdown selection
- **SKU**: Required, auto-generated
- **Brand**: Optional
- **Stock Quantity**: Optional, numeric
- **Description**: Optional, textarea

---

## Color Scheme

- **Background**: Light gradient (slate-50 → blue-50 → slate-100)
- **Cards**: White with gray borders
- **Primary Button**: Blue-600
- **Danger Button**: Red-600
- **Text**: Gray-900 (headings), Gray-600 (body)
- **Errors**: Red-500 borders and text
- **Success**: Emerald-500 backgrounds

---

## Responsive Breakpoints

- **Mobile**: < 640px (1 column)
- **Tablet**: 640px - 1024px (2 columns)
- **Desktop**: 1024px - 1280px (3 columns)
- **Large**: > 1280px (4 columns)

---

## Troubleshooting

### Port Already in Use
If port 3000 is occupied, Next.js will automatically use 3001. To specify:
```bash
PORT=3001 npm run dev
```

### API Connection Issues
Ensure:
1. Backend is running on http://localhost:8080
2. `.env.local` file has correct API URL
3. CORS is enabled on backend

### Build Errors
Clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

### Image Not Loading
Check backend CORS settings allow frontend origin.

---

## Development Tips

**Hot Reload**: Changes auto-refresh in development mode

**Type Safety**: TypeScript checks run automatically

**Linting**: Run `npm run lint` to check code quality

**Format**: Use Prettier or your preferred formatter

---

**Built with ❤️ using Next.js 15, TypeScript, and Tailwind CSS**
# Bulk_Product_JAVA_Frontend
