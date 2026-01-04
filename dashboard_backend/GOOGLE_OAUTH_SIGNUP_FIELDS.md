# Google OAuth Signup - Complete Field Reference

## 📋 Signup Form Fields

Based on the marketing website Trial.tsx form, the signup includes:

### Required Fields
- **full_name**: User's full name (can override Google name)
- **clinic_name**: Name of the clinic
- **id_token**: Google OAuth ID token (from frontend)

### Optional Fields (from form)
- **clinic_type**: Type of clinic (dropdown selection)
  - Options: `primary-care`, `specialty`, `dental`, `physical-therapy`, `mental-health`, `other`
- **clinic_size**: Number of providers (dropdown selection)
  - Options: `solo`, `2-5`, `6-10`, `10plus`
- **email**: Email address (will be verified against Google account)
- **phone**: Phone number
- **timezone**: Clinic timezone (default: `America/New_York`)
- **role**: User role (default: `owner` for first user)

## 🔄 Signup Flow

1. **User fills signup form** on marketing website (`/trial`)
   - Selects clinic type (buttons/dropdown)
   - Selects clinic size (buttons/dropdown)
   - Enters full name, clinic name, email, phone

2. **User clicks "Sign up with Google"**
   - Google OAuth flow initiates
   - User authenticates with Google
   - Frontend receives Google ID token

3. **Frontend sends to backend** `/api/auth/google/signup`
   ```json
   {
     "id_token": "google-id-token",
     "full_name": "John Doe",
     "clinic_name": "Downtown Medical Center",
     "clinic_type": "primary-care",
     "clinic_size": "2-5",
     "email": "john@example.com",
     "phone": "555-1234",
     "timezone": "America/New_York",
     "role": "owner"
   }
   ```

4. **Backend verifies Google token** and creates:
   - New Clinic record (with type, size, timezone)
   - New User record (with Google ID, role: owner)
   - Returns JWT token

5. **Frontend stores token** and redirects to dashboard

## 📝 API Endpoint

### POST `/api/auth/google/signup`

**Request Body:**
```typescript
{
  id_token: string;          // Required - Google OAuth ID token
  full_name: string;         // Required - User's full name
  clinic_name: string;       // Required - Clinic name
  clinic_type?: string;      // Optional - primary-care | specialty | dental | physical-therapy | mental-health | other
  clinic_size?: string;      // Optional - solo | 2-5 | 6-10 | 10plus
  email?: string;            // Optional - Must match Google email
  phone?: string;            // Optional - Phone number
  timezone?: string;         // Optional - Default: "America/New_York"
  role?: string;             // Optional - Default: "owner" for signups
}
```

**Response:**
```json
{
  "access_token": "jwt-token-here",
  "token_type": "bearer"
}
```

## ✅ Validation

- Email from form must match Google account email
- Clinic type must be one of the valid options
- Clinic size must be one of the valid options
- Role must be `admin`, `doctor`, or `owner`
- User cannot already exist (use login endpoint instead)

## 🗄️ Database Storage

- **Clinic table** stores: name, timezone, clinic_type, clinic_size, metadata (phone)
- **User table** stores: email, name, google_id, role (default: owner), clinic_id

## 🔗 Frontend Integration

The frontend API client has been updated with the complete signup function:

```typescript
await auth.googleSignup({
  idToken: "google-token",
  fullName: "John Doe",
  clinicName: "My Clinic",
  clinicType: "primary-care",
  clinicSize: "2-5",
  email: "john@example.com",
  phone: "555-1234",
  timezone: "America/New_York",
  role: "owner"
});
```

