import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const dataFile = path.join(process.cwd(), "dummy-db", "payments.json");

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { orderId, paymentId, signature } = body;
    if (!paymentId || !orderId || !signature) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing fields" }),
        { status: 400 },
      );
    }

    // ensure folder exists
    const dir = path.dirname(dataFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // read existing file (or init empty array if not found)
    let payments: any[] = [];
    if (fs.existsSync(dataFile)) {
      const fileData = fs.readFileSync(dataFile, "utf8");
      if (fileData.trim()) {
        payments = JSON.parse(fileData);
      }
    }

    // append new entry
    const newEntry = {
      paymentId,
      orderId,
      signature,
      storedAt: new Date().toISOString(), // optional timestamp
    };

    payments.push(newEntry);

    // write back
    fs.writeFileSync(dataFile, JSON.stringify(payments, null, 2));

    return new Response(JSON.stringify({ success: true, entry: newEntry }), {
      status: 201,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      {
        status: 500,
      },
    );
  }
}
