import AWS from "aws-sdk";
import fs from "fs";
import os from "os";
import path from "path";
import readline from "readline";
import dotenv from "dotenv";

dotenv.config();

async function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}

function updateAwsCredentials(newValues, profile = "default") {
    const awsCredsPath = path.join(os.homedir(), ".aws", "credentials");
    let credentialsFile = "";

    if (fs.existsSync(awsCredsPath)) {
        credentialsFile = fs.readFileSync(awsCredsPath, "utf8");
    }

    const regex = new RegExp(`\\[${profile}\\][^\\[]*`, "gm");
    const cleanedCreds = credentialsFile.replace(regex, "");

    const section = `[${profile}]
aws_access_key_id = ${newValues.aws_access_key_id}
aws_secret_access_key = ${newValues.aws_secret_access_key}
${newValues.aws_session_token ? `aws_session_token = ${newValues.aws_session_token}` : ""}
`;

    fs.writeFileSync(awsCredsPath, cleanedCreds + section, { encoding: "utf8" });
}

async function main() {
    const serial = process.env.AWS_MFA_ARN;
    if (!serial) {
        console.error("❌ AWS_MFA_ARN not found in .env");
        process.exit(1);
    }

    // 2️⃣ get MFA token
    const tokenCode = await askQuestion("Enter your MFA code: ");    

    const sts = new AWS.STS({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    });

    sts.getSessionToken({
        SerialNumber: serial,
        TokenCode: tokenCode
    }, (err, data) => {
        if (err) {
            console.error("❌ Error getting MFA session token:", err);
            process.exit(1);
        }

        if (!data.Credentials) {
            console.error("❌ Could not obtain MFA credentials");
            process.exit(1);
        }

        // 3️⃣ override [default] with temporary MFA credentials
        updateAwsCredentials({
            aws_access_key_id: data.Credentials.AccessKeyId,
            aws_secret_access_key: data.Credentials.SecretAccessKey,
            aws_session_token: data.Credentials.SessionToken
        });

        console.log("✅ MFA credentials saved in [default] of ~/.aws/credentials (valid ~12h)");
    });
}

main().catch(err => console.error(err));