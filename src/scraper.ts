const axios = require('axios')
const jsdom = require("jsdom")
const { JSDOM } = jsdom

const baseUrl = 'http://kdenisb.org/'
type Link = {
    href: string
    label: string
}
export type Subject = {
    title: string
    links: Array<Link>
}

export const scrap = async (): Promise<void | any> => {
    try {
        return await axios.get(baseUrl);
    } catch (e) {
        return Error(e);
    }
}

export const process = (data: string): any => {
    const html = new JSDOM(data);
    let tmpArr: Array<string> = html.window.document.body.innerHTML.split('<br>');

    tmpArr = tmpArr.filter(item => !item.startsWith('<') && !item.startsWith('\n') && item !== "" )

    const subjects: Array<Subject> = [];

    for (let i = 0; i < tmpArr.length; i++) {
        const title = tmpArr[i].split(':')[0]
        const subject: Subject = {
            title, links: []
        }
        // @ts-ignore
        tmpArr[i].replace(/[^<]*(<a href="([^"]+)">([^<]+)<\/a>)/g, function (): void {
            const tmp: [string, string, string] = Array.prototype.slice.call(arguments, 1, 4)
            const url = tmp[1].startsWith('http') ? tmp[1] : baseUrl+tmp[1]
            subject.links.push({
                href: url,
                label: tmp[2]
            })
        });
        subjects.push(subject)

    }

    return subjects
}
