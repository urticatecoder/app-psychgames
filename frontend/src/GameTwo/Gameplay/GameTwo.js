import React, {useState} from 'react';
import '../../CommonStylings/FullScreenDiv.css'
import ResourceBar from './ResourceBar';
import VerticalPlayerGroup from './VerticalPlayerGroup';
import ResourceButton from '../../Icons/Components/ResourceButton';

const GROUP_ONE = 1
const GROUP_TWO = 2

const KEEP = 'keep'
const INVEST = 'invest'
const COMPETE = 'compete'

function GameTwo(props) {
    
    const FULL_DIV = 'fullDiv';

    return (
        <div className={FULL_DIV}>
            <VerticalPlayerGroup type={GROUP_ONE} allLoginCodes={[1, 2, 3, 4, 5, 6]} players={[1, 2, 3]}/>
            <VerticalPlayerGroup type={GROUP_TWO} allLoginCodes={[1, 2, 3, 4, 5, 6]} players={[4, 5, 6]}/>
            <ResourceButton resource={KEEP} onSelect={() => console.log("keep")}></ResourceButton>
            <ResourceButton resource={INVEST} onSelect={() => console.log("invest")}></ResourceButton>
            <ResourceButton resource={COMPETE} onSelect={() => console.log("compete")}></ResourceButton>

        </div>
    )
}

export default (GameTwo);