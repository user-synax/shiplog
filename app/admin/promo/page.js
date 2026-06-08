export const runtime = "nodejs";

import dbConnect from "../../../lib/db.js";
import PromoCode from "../../../models/PromoCode.js";
import PromoManagerClient from "./PromoManagerClient.jsx";

export default async function PromoPage() {
    await dbConnect();
    const promos = await PromoCode.find().sort({ createdAt: -1 });
    return (
        <PromoManagerClient
            initialPromos={JSON.parse(JSON.stringify(promos))}
        />
    );
}
