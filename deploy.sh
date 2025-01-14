#!/bin/bash

# Set your bucket name
BUCKET_NAME="XXXXXXXXXXXXXXXX"

# Create the bucket
aws s3 mb s3://$BUCKET_NAME

# Enable static website hosting
aws s3 website s3://$BUCKET_NAME --index-document index.html

# Create bucket policy file
cat > bucket-policy.json << EOL
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
        }
    ]
}
EOL

# Apply bucket policy
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

# Upload files
aws s3 sync . s3://$BUCKET_NAME

# Set content types
find . -name "*.html" -exec aws s3 cp {} s3://$BUCKET_NAME/{} --content-type "text/html" \;
find . -name "*.css" -exec aws s3 cp {} s3://$BUCKET_NAME/{} --content-type "text/css" \;
find . -name "*.js" -exec aws s3 cp {} s3://$BUCKET_NAME/{} --content-type "application/javascript" \;

echo "Deployment complete!"
