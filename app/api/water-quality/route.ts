import { NextRequest } from 'next/server';
import { getWaterQualityByAddressIdx } from '../_controllers';

export async function GET(request: NextRequest) {
    return getWaterQualityByAddressIdx(request);
}
