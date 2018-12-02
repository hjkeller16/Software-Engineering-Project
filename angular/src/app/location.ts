export interface Location {
    readonly id: number,
    category: string,
    name: string,
    description: string,
    address: string,
    lat: number,
    lng: number,
    user_id: string,
    image: FormData
}
