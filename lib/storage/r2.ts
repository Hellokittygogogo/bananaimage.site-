import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const req = (n: string) => {
  const v = (process.env as Record<string, string | undefined>)[n];
  if (!v) throw new Error('Missing env ' + n);
  return v;
};

function client() {
  const accountId = process.env.R2_ACCOUNT_ID || '';
  const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
  return new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId: req('R2_ACCESS_KEY_ID'),
      secretAccessKey: req('R2_SECRET_ACCESS_KEY'),
    },
  });
}

export async function presignPutUrl(key: string, contentType: string, expiresIn = 300) {
  const Bucket = req('R2_BUCKET');
  const url = await getSignedUrl(
    client(),
    new PutObjectCommand({ Bucket, Key: key, ContentType: contentType }),
    { expiresIn }
  );
  return { url };
}

export async function presignGetUrl(key: string, expiresIn = 300) {
  const Bucket = req('R2_BUCKET');
  const url = await getSignedUrl(
    client(),
    new GetObjectCommand({ Bucket, Key: key }),
    { expiresIn }
  );
  return { url };
}

export function publicUrlFor(key: string) {
  const base = (process.env.R2_PUBLIC_BASE_URL || '').replace(/\/$/, '');
  return base ? `${base}/${key}`.replace(/\/+/, '/') : null;
}
