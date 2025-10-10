# Plant Identifier - Full Stack Web Application

A comprehensive plant identification system built with Django REST Framework backend and React TypeScript frontend, featuring AI-powered plant recognition, user authentication, and admin dashboard.

## 🌱 Features

- **AI Plant Identification**: Upload plant images for instant species identification
- **User Authentication**: Complete auth system with registration, login, password reset
- **Admin Dashboard**: Comprehensive admin panel with analytics and plant management
- **Responsive Design**: Modern UI with dark/light theme support
- **Database Management**: Plant species database with detailed information
- **Email Integration**: Password reset via email with verification codes

## 🚀 Quick Start

### Prerequisites

- Python 3.8+ 
- Node.js 16+
- npm or yarn
- Git

### Backend Setup (Django)

1. **Clone the repository**
   ```bash
   git clone https://github.com/joshsoco/Plant_Admin.git
   cd Final_proj-Josh/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your settings (see Environment Variables section)
   ```

5. **Database setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   
   # Create superuser (optional)
   python manage.py createsuperuser
   ```

6. **Run development server**
   ```bash
   python manage.py runserver
   ```
   Backend will be available at `http://localhost:8000`

### Frontend Setup (React + TypeScript)

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment setup**
   ```bash
   # Create .env file
   echo "VITE_API_BASE_URL=http://localhost:8000" > .env
   ```

4. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Frontend will be available at `http://localhost:5173`

## 📋 Environment Variables

### Backend (.env)
```env
# Django Configuration
SECRET_KEY=your-super-secret-key-here-change-this
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com

# Database
DATABASE_URL=sqlite:///db.sqlite3

# Email Configuration (for password reset)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-gmail-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
```

## 🔧 Email Configuration

For password reset functionality, you'll need to configure Gmail SMTP:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Update backend/.env** with your Gmail credentials

## 📁 Project Structure

```
Final_proj-Josh/
├── backend/                    # Django REST API
│   ├── authentication/        # User auth app
│   ├── webproject/            # Django project settings
│   ├── requirements.txt       # Python dependencies
│   └── manage.py             # Django management
├── frontend/                  # React TypeScript app
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── features/         # Feature-based modules
│   │   ├── pages/           # Page components
│   │   └── ...
│   ├── package.json         # Node dependencies
│   └── vite.config.ts       # Vite configuration
└── README.md
```

## 🛠 Development Commands

### Backend
```bash
# Install dependencies
pip install -r requirements.txt

# Database migrations
python manage.py makemigrations
python manage.py migrate

# Run development server
python manage.py runserver

# Run tests
python manage.py test

# Create superuser
python manage.py createsuperuser
```

### Frontend
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
npm run lint:fix

# Type checking
npm run type-check
```

## 🚀 Deployment

### Frontend (Netlify)
1. Build the project: `npm run build`
2. Deploy `dist` folder to Netlify
3. Configure redirects using `public/_redirects`

### Backend (Railway/Heroku)
1. Add production environment variables
2. Update `ALLOWED_HOSTS` in settings
3. Configure static files serving
4. Deploy using platform-specific instructions

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/refresh/` - Refresh JWT token
- `POST /api/auth/forgot-password/` - Request password reset
- `POST /api/auth/verify-reset-code/` - Verify reset code
- `POST /api/auth/reset-password/` - Reset password

## 🧪 Testing

### Backend
```bash
cd backend
python manage.py test
```

### Frontend
```bash
cd frontend
npm run test
```

## 📦 Dependencies

### Backend (requirements.txt)
- Django 5.1.3
- djangorestframework 3.15.2
- django-cors-headers 4.4.0
- djangorestframework-simplejwt
- python-decouple 3.8

### Frontend (package.json)
- React 19.1.0
- TypeScript 5.8.3
- Vite 7.0.4
- Tailwind CSS
- Framer Motion 12.23.3
- Radix UI components

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure frontend URL is in `CORS_ALLOWED_ORIGINS`
   - Check backend is running on correct port

2. **Email Not Sending**
   - Verify Gmail App Password is correct
   - Check 2FA is enabled on Gmail account

3. **Database Issues**
   - Run `python manage.py migrate`
   - Delete `db.sqlite3` and migrate again if needed

4. **Port Already in Use**
   ```bash
   # Kill process using port 8000 (backend)
   lsof -ti:8000 | xargs kill -9
   
   # Kill process using port 5173 (frontend)
   lsof -ti:5173 | xargs kill -9
   ```

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributors

- Allen Rodas - LLM & Project Manager
- Mark Delfin - Lead Plant Vision Engineer  
- Royal Rex - Database Curator & Taxonomist
- Joshua Co - Front-End Developer

---

For more information, visit our [documentation](link-to-docs) or contact the development team.
