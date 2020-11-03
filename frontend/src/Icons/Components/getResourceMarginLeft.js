const KEEP = "keep"
const INVEST = "invest"
const COMPETE = "compete"

const KEEP_MARGIN_LEFT = '45vw';
const INVEST_MARGIN_LEFT = '57vw';
const COMPETE_MARGIN_LEFT = '69vw';

function getResourceMarginLeft(resource) {
    switch(resource) {
        case KEEP: return KEEP_MARGIN_LEFT;
        case INVEST: return INVEST_MARGIN_LEFT;
        case COMPETE: return COMPETE_MARGIN_LEFT;
    }
}

export default getResourceMarginLeft;