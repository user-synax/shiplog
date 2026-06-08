export const runtime = "nodejs";

import { auth } from "../../../../../auth.js";
import dbConnect from "../../../../../lib/db.js";
import PromoCode from "../../../../../models/PromoCode.js";
import { isAdminEmail } from "../../../../../lib/utils.js";

export async function PATCH(req, { params }) {
    const session = await auth();
    const isAdmin = isAdminEmail(session?.user?.email);
    if (!isAdmin) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const body = await req.json();
    const promo = await PromoCode.findByIdAndUpdate(
        params.id,
        { isActive: body.isActive },
        { new: true },
    );
    return Response.json(promo);
}
