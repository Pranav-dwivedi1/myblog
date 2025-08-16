# Blog Application

A Node.js/Express blog application with MongoDB integration.

## ✅ **Fixed Issues for Vercel Deployment**

The following critical issues have been resolved:
- ✅ Created missing `index.js` entry point
- ✅ Fixed MongoDB session store (now uses environment variable)
- ✅ Changed file uploads to memory storage (required for serverless)
- ✅ Implemented base64 image storage for Vercel compatibility
- ✅ Removed static file serving for uploads

## Deployment on Vercel

### Prerequisites
1. MongoDB Atlas account (for cloud database)
2. Vercel account

### Environment Variables Setup in Vercel

Go to your Vercel project dashboard → Settings → Environment Variables and add:

```
MONGO_Url=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database
SESSION_SECRET=your-super-secret-session-key-here
```

### Steps to Deploy

1. **Push your code to GitHub** (if not already done)
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect it's a Node.js app

3. **Configure Environment Variables** (see above)

4. **Deploy**: Vercel will automatically deploy your app

### ⚠️ **Important Notes for Vercel Deployment**

1. **File Uploads**: File uploads work by storing images as base64 in the database. This is suitable for smaller images but may impact performance for large files.

2. **Session Storage**: Sessions are stored in MongoDB Atlas

3. **Static Files**: Only basic static files are served from the public directory

### Troubleshooting Internal Server Errors

If you're still getting internal server errors:

1. **Check Vercel Logs**:
   - Go to your Vercel dashboard
   - Click on your deployment
   - Check the "Functions" tab for error logs

2. **Common Issues**:
   - Missing environment variables
   - MongoDB connection string issues
   - Missing dependencies

3. **Verify MongoDB Connection**:
   - Ensure your MongoDB Atlas cluster is accessible
   - Check if your IP is whitelisted (or use 0.0.0.0/0 for all IPs)
   - Verify connection string format

4. **Check Dependencies**:
   - All dependencies are listed in `package.json`
   - No missing native modules

### Local Development

```bash
npm install
npm run dev
```

Make sure to create a `.env` file with the same environment variables for local development.

### Future Improvements

For better file upload handling on Vercel:
1. Integrate with cloud storage services (AWS S3, Cloudinary, etc.)
2. Implement image compression before base64 storage
3. Add file size limits for uploads
