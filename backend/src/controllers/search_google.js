const axios = require("axios");
const fs = require('fs')
const {parse} = require('himalaya');

const getTitles = (titleArray, children) => {
    if (children.length) {
        children.filter(itemChildren => {
            if ((itemChildren || {type: ''}).type === 'element' &&
                (itemChildren || {tagName: ''}).tagName === "div" &&
                ((itemChildren || {atributes: []}).attributes || []).find(attribute => attribute.key === "class" && attribute.value === "BNeawe vvjwJb AP7Wnd") && 
                ((itemChildren || {children: []}).children || []).length &&
                ((itemChildren || {children: []}).children[0] || {})['type'] === 'text' &&
                !!((itemChildren || {children: []}).children[0] || {})['content']
            ) {
                titleArray.push((itemChildren || {children: []}).children[0]['content']);
            } else if (((itemChildren || {children: []}).children || []).length) {
               getTitles(titleArray, (itemChildren || {children: []}).children)
            }

            return true
        })
    }
}

const getUrls = (urlsArray, children) => {
    if (children.length) {
        children.filter(itemChildren => {
            if ((itemChildren || {type: ''}).type === 'element' &&
                (itemChildren || {tagName: ''}).tagName === "div" &&
                ((itemChildren || {atributes: []}).attributes || []).find(attribute => attribute.key === "class" && attribute.value === "egMi0 kCrYT") && 
                ((itemChildren || {children: []}).children || []).length &&
                ((itemChildren || {children: []}).children || []).find(item => 
                    item.type === 'element' &&
                    item.tagName === 'a' &&
                    (item.attributes || []).find(attribute => attribute.key === 'href' && attribute.value.includes('/url?'))
                )
            ) {
                const childrenWithHrefAttribute = ((itemChildren || {children: []}).children || []).find(item => 
                    item.type === 'element' &&
                    item.tagName === 'a' &&
                    (item.attributes || []).find(attribute => attribute.key === 'href' && attribute.value.includes('/url?'))
                )
                const hrefAttribute = (childrenWithHrefAttribute.attributes || []).find(attribute => attribute.key === 'href' && attribute.value.includes('/url?'))
                urlsArray.push(hrefAttribute.value.split('?q=')[1].split('&amp')[0]);
            } else if (((itemChildren || {children: []}).children || []).length) {
                getUrls(urlsArray, (itemChildren || {children: []}).children)
            }

            return true
        })
    }
}

const formatResponse = (titles, urls) => {
    const finalResponse = [];
    if (!titles.length || !urls.length) return finalResponse;
    
    for (let [index, title] of titles.entries()) {
        finalResponse.push({
            title: title,
            url: urls[index]
        })
    }
    
    return finalResponse;
}


module.exports = {
    // <h3 class="zBAuLc l97dzf"
    // <a href="/url?q egMi0 kCrYT

	async getSearchGoogle(request, response) {
        try {
            const baseUrl = "https://www.google.com/search";
            const {search, start} = request.query;

            if (!search) return response.status(403).json({message: 'Favor digitar um valor para pesquisa'});

            const requestResponse = await axios.get(baseUrl, {
                params: {
                    q: ((search || '').trim() || '').replace(/ /g, '+'),
                    start: start ? start : 0
                },
                headers: { 'content-type': 'charset=UTF-8' },
            });

            fs.writeFileSync('teste.html', requestResponse.data, {encoding: 'utf-8'});
            const html = fs.readFileSync('teste.html', {encoding: 'utf8'});
            const json = parse(html);
            fs.unlinkSync('teste.html');
            const titles = [];
            const urls  = [];
            if ((json || []).length > 1 && json[1]) {
                getTitles(titles, json[1].children);
                getUrls(urls, json[1].children)
            }

            return response.status(200).json(formatResponse(titles, urls));
        } catch (err) {
            console.log(err.stack);
            return response.status(500).json({message: err.stack})
        }
	}
}