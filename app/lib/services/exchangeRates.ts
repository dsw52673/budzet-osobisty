export async function getExchangeRate(currency: string, dateStr?: string): Promise<number> {
    const code = currency.toLowerCase()
    if (code === "pln") {
        return 1.0
    }

    try {
        let url = `http://api.nbp.pl/api/exchangerates/rates/a/${code}/?format=json`
        if (dateStr) {
            const date = new Date(dateStr).toISOString().split("T")[0]
            url = `http://api.nbp.pl/api/exchangerates/rates/a/${code}/${date}/?format=json`
        }

        const res = await fetch(url)
        if (!res.ok) {
            const fallbackRes = await fetch(`http://api.nbp.pl/api/exchangerates/rates/a/${code}/last/1/?format=json`)
            if (!fallbackRes.ok) {
                throw new Error("Nie udało się pobrać kursu waluty")
            }
            const fallbackData = await fallbackRes.json()
            return fallbackData.rates[0].mid
        }

        const data = await res.json()
        return data.rates[0].mid
    } catch (err) {
        console.error("Błąd pobierania kursu:", err)
        throw err
    }
}
