

export class formatUtils{
    static formatDate(date: Date){
        return new Intl.DateTimeFormat('id-ID',{
            dateStyle: 'full',
            timeStyle: 'short',
            timeZone: 'Asia/Jakarta',
        }).format(date);
    }

}