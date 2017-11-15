import React from 'react';
import pageConnect from '../hoc/pageConnect';
import stylesheet from './style/parallax.scss';

export default pageConnect((props) => {
    return (
        <div className="parallax-page">
            <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
            This is parallax page
        </div>
    );
})