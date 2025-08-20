# Google Sheets Integration Setup Guide

This guide will help you connect your whiskey collection app directly to your Google Sheets spreadsheet for real-time data synchronization.

## Prerequisites

- A Google Cloud Platform account
- Your whiskey collection data in a Google Sheets spreadsheet
- Basic knowledge of environment variables

## Step 1: Prepare Your Google Sheets

1. **Open your Google Sheets** with your whiskey collection data
2. **Ensure your columns are in this order:**
   ```
   A: Name
   B: Quantity  
   C: Country
   D: Type
   E: Region
   F: Distillery
   G: Age
   H: Purchase Date
   I: ABV
   J: Size
   K: Purchase Price
   L: Status
   M: Batch
   N: Notes
   O: Current Value
   ```

3. **Copy the Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
   ```

## Step 2: Create Google Cloud Service Account

1. **Go to Google Cloud Console:**
   - Visit [console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project or select an existing one

2. **Enable Google Sheets API:**
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

3. **Create a Service Account:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the service account details:
     - Name: `whiskey-collection-reader`
     - Description: `Service account for whiskey collection app`
   - Click "Create and Continue"
   - Skip optional steps and click "Done"

4. **Generate Service Account Key:**
   - Click on the created service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose "JSON" format
   - Download the key file and save it securely

## Step 3: Share Your Spreadsheet

1. **Open your Google Sheets**
2. **Click "Share" button**
3. **Add the service account email** (found in the JSON key file as `client_email`)
4. **Set permissions to "Viewer"** (or "Editor" if you want to add new whiskeys through the app)
5. **Click "Send"**

## Step 4: Configure Environment Variables

1. **Copy the environment template:**
   ```bash
   cp env.example .env.local
   ```

2. **Edit `.env.local` with your values:**
   ```env
   GOOGLE_SHEETS_ID=your_spreadsheet_id_here
   GOOGLE_SERVICE_ACCOUNT_KEY_FILE=./path/to/your/service-account-key.json
   ```

   **Alternative method (more secure for deployment):**
   Instead of using a file path, you can use the key content directly:
   ```env
   GOOGLE_SHEETS_ID=your_spreadsheet_id_here
   GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
   ```

## Step 5: Update Google Sheets Library (Alternative Authentication)

If you prefer to use environment variables instead of a key file, update `src/lib/googleSheets.ts`:

```typescript
// Replace the auth setup with:
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});
```

## Step 6: Test the Integration

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Open the app** at `http://localhost:3000`

3. **Toggle the "Google Sheets" switch** in the Data Source section

4. **Verify your data loads** from the spreadsheet

## Troubleshooting

### Common Issues:

**"Service account does not have access"**
- Make sure you shared the spreadsheet with the service account email
- Check that the service account has at least "Viewer" permissions

**"Spreadsheet not found"**
- Verify the GOOGLE_SHEETS_ID is correct
- Make sure the spreadsheet is accessible to the service account

**"Invalid credentials"**
- Check that your service account key file is valid and accessible
- Verify environment variables are set correctly

**"API not enabled"**
- Ensure Google Sheets API is enabled in your Google Cloud project

### Debug Mode:

Add console logging to see what's happening:

```typescript
// In src/lib/googleSheets.ts, add:
console.log('Spreadsheet ID:', SPREADSHEET_ID);
console.log('Auth config:', process.env.GOOGLE_CLIENT_EMAIL ? 'Using env vars' : 'Using key file');
```

## Security Best Practices

1. **Never commit** your service account key file or `.env.local` to version control
2. **Use environment variables** for production deployments
3. **Limit permissions** - only give the service account the minimum required access
4. **Rotate keys** periodically for enhanced security

## Production Deployment

For production deployment (Vercel, Netlify, etc.):

1. **Set environment variables** in your hosting platform's dashboard
2. **Use the GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY** method instead of key files
3. **Test thoroughly** before going live

## Features Available

Once configured, you can:

✅ **View live data** from your Google Sheets  
✅ **Add new whiskeys** directly to your spreadsheet (if you gave "Editor" permissions)  
✅ **Real-time sync** - changes in your spreadsheet appear immediately in the app  
✅ **Fallback to local data** if the connection fails  

---

Need help? Check the console for error messages or create an issue in the repository.
