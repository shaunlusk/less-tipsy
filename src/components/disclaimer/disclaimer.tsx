import * as React from 'react';
import './disclaimer.scss';

export interface IDisclaimerProps {
    accept(): void;
}

interface IDisclaimerState {
    accepted: boolean;
}

export class Disclaimer extends React.Component<IDisclaimerProps, IDisclaimerState> {
    public constructor(props: IDisclaimerProps) {
        super(props);

        this.state = {
            accepted: false
        }
    }

    private _setAccepted(value: boolean): void {
        this.setState({accepted: value});
    }

    private _submit(): void {
        if (this.state.accepted) {
            this.props.accept();
        }
    }

    public render() {
        return (
            <div className="disclaimer-blackout">
                <div className="disclaimer-main">
                    <h3>Terms and Conditions</h3>
                    <div className="disclaimer-content">
                        <p><strong>General</strong></p>
                        <p>You the user of this application agree to accept sole responsibility for the 
                            usage of this application and any consequences resulting from the usage of 
                            this app.  You agree to absolve the author of any consequences resulting 
                            from this app or its usage.
                        </p>
                        <p><strong>Health Disclaimer</strong></p>
                        <p>You must be at least the minimum age to consume alcohol in your jurisdiction.
                            To use this app, you agree to first consult with your doctor about the effects 
                            of reducing or eliminating alcohol consumption; some individuals may have serious 
                            life threatening side effects associated with sudden alcohol withdrawal.
                        </p>
                        <p>This app exists purely to help with tracking alcohol consumption.  By using this 
                            app, you agree not to consume more than the recommended about of alcohol as 
                            defined by your jurisdictions health services or your doctor, whichever is less.  
                            If no such health service exists in your jurisdiction and/or no doctor is available 
                            to you, you agree not to use this app.
                        </p>
                        <p>You agree not to increase your current alcohol consumption while using this app.
                        </p>
                        <p>If you have any existing health issues that might be exacerbated by drinking alcohol, 
                            or potential health issues that might result from drinking, or reducing alcohol consumption, 
                            you agree not to use this app.
                        </p>
                        <p><strong>Data Disclaimer</strong></p>
                        <p>This application collects data in local browser storage.  It is not transmitted or made 
                            available to anyone through the application or site. You own the data and may delete or 
                            transmit it at your own discretion.
                        </p>
                        <p>It may be possible for other websites to track your usage of this site; you agree to 
                            indemnify the author for any such occurances.
                        </p>
                        <p><strong>Software Disclaimer</strong></p>
                        <p>This application is provided "as is" and "as available", with no warranty, and no 
                            gaurantee of fitness for a particular purpose.
                        </p>
                        <p>This is free and open source software, issued under the MIT license (source code and 
                            license available at <a href="https://github.com/shaunlusk/less-tipsy">https://github.com/shaunlusk/less-tipsy</a>).
                        </p>

                        <p><strong>Jurisdiction Disclaimer</strong></p>
                        <p>If any of these terms is not enforceable or is prohibited by law, or cannot otherwise be 
                            applied, you agree not to use this application.
                        </p>
                        <p><strong>Miscellaneous</strong></p>
                        <p>These terms are subject to change without notice.</p>
                        <p>By using this app, you accept these terms in their entirety.</p>
                        <p>Please drink responsibly.</p>
                        <p><input type="checkbox" id="accept-check" onChange={(e) => this._setAccepted(e.target.checked)} checked={this.state.accepted}></input>
                            <label htmlFor="accept-check">I Agree to the terms.</label></p>
                        <div className="disclaimer-buttons">
                            <button className="btn btn-accept disclaimer-buttons-accept" onClick={() => this._submit()}>I Accept</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
