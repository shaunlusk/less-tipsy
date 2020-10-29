import React, { FunctionComponent } from 'react';

export interface IHowToPanelProps {
    viewedHowToPanel(): void;
}

export const HowToPanel: FunctionComponent<IHowToPanelProps> = ({viewedHowToPanel}) => {
    viewedHowToPanel();
    return <div>
        <h3>How-To</h3>
        <p>This application tracks alcohol consumption.  Consumption is tracked using alcohol units.  See the 'About' tab for more information on this calculation.</p>
        <p><strong>Basic Usage</strong></p>
        <p>To begin a new session, click the 'Session' tab, and click the 'Begin New Session' button. 
        </p>
        <p>
            From there, every time you start a new drink, fill in the drink volume and ABV percentage, and click 'Add'.
            This will add the drink to your current session. 
        </p>
        <p>
            To remove the last drink, click the 'x' button, next to the last drink entry.
        </p>
        <p>
            To Finish or Cancel the current session, click the appropriate button at the bottom of the session panel.
        </p>
        <p>
            Your drinks will be tracked, and the session summary shown in the lower of the Session tab.
            All calculations of rates and alcohol units remaining are based on your Settings.
        </p>
            <ul>
                <li>The Last Drink section shows the detail about the last drink consumed.</li>
                <li>The Next Drink section shows the time for your next drink, based on your configured consumption rate.</li>
                <li>Session Total shows the total alcohol units you have consumed this session.</li>
                <li>Session Remaining shows how many alcohol units you are allowed for the remainder of this session.</li>
                <li>Rolling Hourly rate shows how many alcohol units you have consumed per hour on average for the current session.</li>
                <li>Rolling Weekly Total shows the total alcohol units you have consumed over the past 7 days, including the current session.</li>
                <li>Rolling Weekly Remaining shows how many alcohol units your are allowed for the current week.</li>
            </ul>
        <p>
            Any totals or limits that are exceeded will be shown in red; as well the 'Add' button will turn red.
        </p>
        <h3>Settings</h3>
        <p>The settings tab lets you configure:</p>
        <ul>
            <li>The maximum allowed alcohol units per session.</li>
            <li>The maximum allowed alcohol units per week.</li>
            <li>The recommended consumption rate in units per hours.</li>
            <li>The number of sessions to be stored in the history tab.</li>
        </ul>
        <h3>History</h3>
        <p>The history tab tracks your sessions by date. This information is only stored locally in the browser; it is not transmitted elsewhere (see About tab).
        </p><p>
            If you wish to move your history to another device you will need to export it from the current device, then import the file on the target device.
        </p>
    </div>;
}
