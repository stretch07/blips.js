export class Blips {
    constructor(PHPSESSID) {
        this.PHPSESSID = PHPSESSID;
    }

    async getAuthor(username) {
        const res = await fetch(`https://blips.club/${username}`, {
            method: "GET",
            headers: {
                "Cookie": `PHPSESSID=${this.PHPSESSID}`
            }
        })
        const html = await res.text()
        let parser = new DOMParser();
        let document = parser.parseFromString(html, "text/html");

        // BLIPS
        const list = document.querySelectorAll("#content > div.feed.center > div")
        let blips = [];
        list.forEach(element => {

            const dateString = element.querySelector("div.body > small > abbr").getAttribute("title")
            const date = new Date(dateString)

            blips.push({
                content: element.querySelector("div.body > span").innerText,
                date: date,
            })
        })

        // ABOUT FIELDS
        const about = document.querySelector("ul.about")
        const aboutData = {}
        for (const child of about.children) {
            const field = child.querySelector("strong").innerText

            aboutData[field.toLowerCase()] = child.innerText.substring(field.length + 1) // filter out field name and space

        }

        return {
            blips: blips,
            about: aboutData
        }
    }
}