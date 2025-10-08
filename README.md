# Project: get-token

This project allows you to obtain a temporary AWS token using MFA (Multi-Factor Authentication).  The generated credentials are valid for `12 hours`.

## Environment requirements (`.env`)

To run the project, you must create a `.env` file in the root directory with the following variables:

```
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_MFA_SERIAL=arn:aws:iam::123456789012:mfa/your-user
AWS_REGION=us-east-1
```

- `AWS_ACCESS_KEY_ID`: Your AWS Access Key ID.
- `AWS_SECRET_ACCESS_KEY`: Your AWS Secret Access Key.
- `AWS_MFA_SERIAL`: ARN of the MFA device associated with your AWS user.
- `AWS_REGION`: AWS region to use (e.g., `us-east-1`).

**Note:** Do not share your `.env` file or credentials.

## Usage

1. Install dependencies:
   ```sh
   npm install
   ```
2. Run the main script:
   ```sh
   npm run start
   ```

## Additional Documentation

This project generates temporary AWS access tokens (access key, secret key, and session token) and writes them to the file `~/.aws/credentials` for use with the AWS CLI and SDKs. The generated credentials are valid for 12 hours.


## Example

**IAM user configuration or permissions diagram: copy to .env**
![IAM user configuration](doc/user-iam.png)


**Example of an MFA code or MFA device screenshot: paste the MFA code**
![MFA code example](doc/mfa%20code.png)

**Access configuration with session token**
![Access configuration](doc/acces.png)



---

**Team:** If you have questions about the `.env` configuration or project usage, contact the repository maintainer.