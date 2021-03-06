const $ = require('cheerio')

function htmlParsingService() {
    const groupsElId = 'edit-studygroup-abbrname-selective'
    const instituteElId = 'edit-departmentparent-abbrname-selective'

    const types = ['group_full', 'group_chys', 'group_znam', 'sub_1_full', 'sub_2_full', 'sub_1_chys', 'sub_1_znam', 'sub_2_chys', 'sub_2_znam']

    const extractGroups = html => {
        const groupsRes = $(`#${groupsElId} > option`, html)
        return new Array(groupsRes.length).fill().map((_, i) => groupsRes[i].attribs.value).slice(1)
    }

    const extractInstitutes = html => {
        const institutesRes = $(`#${instituteElId} > option`, html)
        return new Array(institutesRes.length).fill().map((_, i) => institutesRes[i].attribs.value).filter(_ => _ !== 'All')
    }

    const extractRozkladData = html => {
        const days = $(`.view-content > .view-grouping`, html).toArray()
        return  days.map(d => {
            const cnt = $('.view-grouping-content', d).children().toArray()
            return {
                day: $(d).find('.view-grouping-header').text(),
                pairs: new Array(cnt.length / 2).fill().map((_, i) =>
                    ({
                        pairNum: cnt[i * 2].children[0].data,
                        details: cnt[i * 2 + 1].children.filter(_ => _.children)
                            .map(c => {
                                const t = $(c.children[0].children[2]).text()
                                return ({
                                    subject: $(c.children[0].children[0]).text(),
                                    teacher: t.substring(0, t.length - 2).trim(),
                                    pairType: $(c).attr('id'),
                                    isCurrentWeek: $(c).attr('class') === 'week_color',
                                    type: $(c.children[0].children[4]).text().slice(1).trim(),
                                    href: $(c.children[0].children[6]).children().attr('href')
                                })
                            })
                    })
                )
            }
        })
    }

    return {
        extractGroups,
        extractInstitutes,
        extractRozkladData
    }
}

module.exports = htmlParsingService