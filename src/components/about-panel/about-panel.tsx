import React, { FunctionComponent } from 'react';

export const AboutPanel: FunctionComponent = () => {
    return <div>
        <h3>About</h3>
        <div>
            <p><strong>Alcohol Units</strong></p>
            <p>This application uses Acohol Units to track alcohol consumption.  An alcohol unit is defined as 10ml or 8g of pure alcohol; this definition is provided by the <span>
            <a target="_blank" rel="noopener noreferrer" href="https://www.nhs.uk/live-well/alcohol-support/calculating-alcohol-units/" title="Alcohol Units - NHS">National Health Service (UK)</a></span>.
            </p>
            <p>As such, the defaults for alcohol consumption in this app are set to amount recommended by the NHS: a maximum of 14 units per week.  You may changes these settings, but you do so at your own risk.</p>
            <p>Also note that an alcohol unit is roughly (but not precisely!) equivalent to 1/2 of a U.S. "standard" drink.</p>
            <p><strong>Data Persistence</strong></p>
            <p>All settings, current session data, and session history are stored only in the local browser storage. 
                This means the data will only be available in the current browser and device.  
                If you wish to move the data to another browser or device, you will need to export it 
                (.csv format) from the History tab and import in the History tab of the target browser/device.</p>
            <p>While this isn't as convenient as cloud storage, it allows you to own the data, and prevents selling, theft, or misuse of the data.</p>
        </div>
        <p><strong>Author &amp; License</strong></p>
        <p>This application was created by <a target="_blank" rel="noopener noreferrer" href="https://www.github.com/shaunlusk" title="Shaun Lusk">Shaun Lusk</a>. It is licensed under the MIT open source license (see LICENSE file in source code for more details).</p>
        <p><strong>Credits</strong></p>
        <p>
            Icon made by <a target="_blank" rel="noopener noreferrer" href="https://www.flaticon.com/authors/good-ware" title="Good Ware">Good Ware</a> from <a target="_blank" rel="noopener noreferrer" href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
        </p>
    </div>;
}
