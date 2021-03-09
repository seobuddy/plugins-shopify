const md5 = require("blueimp-md5");
const { API_HOST } = process.env;

const getSeobuddyShopInfo = async (shopId) => {
    let encodedId = md5(md5('_deby_' + shopId + '_sebdy_'));

    const response = await fetch(API_HOST + `/management-api/project/get_credentials_for_remote_system/` + encodedId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return await response.json();
};

module.exports = getSeobuddyShopInfo;