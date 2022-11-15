export class QRcode {
    id: number;
    company: string;
    site: string;
    checkpoint: string;
    location: {
        latitude: number;
        longitude: number;
    };
    time: string;
    date: string;
    name?: string;
    thumb?: string;
}
