export class DateUtil {
    constructor() {}

    public getMonth(date: string | Date): number {
        return new Date(date).getMonth() + 1;
    }
}
