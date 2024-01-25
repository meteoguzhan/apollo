import { IndexModel } from "../models/IndexModel"
import { ConsumptionModel } from "../models/ConsumptionModel"
import moment from "moment"
import { UserModel } from "../models/UserModel"

class IndexService {
    static async addIndex(indexValue: number, date: string, user?: UserModel): Promise<boolean> {
        try {
            // Girilen tarihten büyük/eşit ise ve girilen endeksden küçük/eşit ise
            const greaterIndexes = await IndexModel.find({ userId: user?._id, date: { $gte: date }, indexValue: { $lte: indexValue } })
            if (greaterIndexes.length > 0) {
                // 1. Seçenek
                // * Bu durumda, girilen tarihten sonraki ve eşit/küçük endeksleri sil
                await IndexModel.deleteMany({ userId: user?._id, date: { $in: greaterIndexes.map((index) => index.date) } })

                // 2. Seçenek
                // * Proccessin devam etmesini engelle (Devam ederse tüketim tablosunda negatif değerleride hesaplar.)
                // return false;
            }

            // Belirtilen tarihte zaten bir endeks var mı kontrol et
            const existingIndex = await IndexModel.findOne({ userId: user?._id, date: date })
            if (existingIndex) {
                // Eğer varsa, mevcut endeksi güncelle
                existingIndex.indexValue = indexValue
                await existingIndex.save()
            } else {
                // Yoksa, yeni bir endeks ekle
                const index = new IndexModel({ indexValue: indexValue, date: date, userId: user?._id })
                await index.save()
            }

            // Tüketimi güncelle
            await this.calculateConsumption(user)
            return true
        } catch (error) {
            return false
        }
    }

    static async calculateConsumption(user?: UserModel): Promise<boolean> {
        try {
            // * En son eklenen endeksin tarihini al
            const date = (await IndexModel.find({ userId: user?._id }).sort({ date: -1 }).limit(1))[0].date

            // * Tarih filtresi ile tüm endeksleri getir, tarihe göre sırala
            const allIndexes = await IndexModel.find({ userId: user?._id, date: { $lte: date } }).sort({ date: 1 })

            const consumptionValues: ConsumptionModel[] = []

            // * Endeksler arasındaki tüketimi hesapla
            for (let i = 0; i < allIndexes.length - 1; i++) {
                const currentIndex = allIndexes[i]
                const nextIndex = allIndexes[i + 1]
                const daysBetween: number = moment(nextIndex.date).diff(moment(currentIndex.date), "days")
                const dailyConsumption: number = (nextIndex.indexValue - currentIndex.indexValue) / daysBetween

                //* Günlük tüketim değerlerini tarihlere göre oluştur ve diziye ekle
                for (let j = 0; j < daysBetween; j++) {
                    const consumptionDate: string = moment(currentIndex.date).add(j, "days").format("YYYY-MM-DD")
                    consumptionValues.push({ date: consumptionDate, consumption: dailyConsumption } as ConsumptionModel)
                }
            }

            // 1. Seçenek
            // * Mevcut tüketim listesinde olmayan tarihleri sil
            const existingDates = consumptionValues.map((value) => value.date)
            await ConsumptionModel.deleteMany({ userId: user?._id, date: { $nin: existingDates } })

            // * Mevcut tüketim bilgilerini güncelle veya ekle
            await ConsumptionModel.bulkWrite(
                consumptionValues.map((value: ConsumptionModel) => ({
                    updateOne: {
                        filter: { userId: user?._id, date: value.date },
                        update: { $set: { consumption: value.consumption } },
                        upsert: true
                    }
                }))
            )

            // 2. Seçenek
            // // * Mevcut tüketim bilgilerini sil ve yeni hesaplananları ekle
            // await ConsumptionModel.deleteMany({userId: user?._id})
            // await ConsumptionModel.insertMany(consumptionValues)

            return true
        } catch (error) {
            return false
        }
    }
}

export default IndexService
