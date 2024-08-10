export const myDomain = "src=\""+ "https://orchard.kheshtin.ir"//process.env.ANGULAR_APP_BASE_URL;
 export const getImagesWithAbsolutePath = (text, absolutePathPrefix) => {
        if (!text) return ''
        const regex =  new RegExp(`(?:src=\"\/*)+(.*?)`, "g")
        return text.replace(regex,  absolutePathPrefix + '/$1')
    }