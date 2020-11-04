const KEEP = "keep"
const INVEST = "invest"
const COMPETE = "compete"

const KEEP_COLOR = '#e3aac9'
const INVEST_COLOR = '#36c960'
const COMPETE_COLOR = '#f5d971'

function getResourceBackgroundColor(resource) {
    switch(resource) {
        case KEEP: return KEEP_COLOR;
        case INVEST: return INVEST_COLOR;
        case COMPETE: return COMPETE_COLOR;
    }
}
export default getResourceBackgroundColor