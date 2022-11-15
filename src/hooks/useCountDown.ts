import {useEffect, useState} from "react";
import moment from "moment";


const useCountDown = ({countDownTime }: any) => {
    
    const [time, setTime] = useState<any>({});

    const padStartNumber = (number:any, field:any) => {
        if (field === 'days' && !number) {
            return '';
        } else {
            return number.toString().padStart(2, "0");
        }
    }
    useEffect(() => {
        if (!countDownTime) {
            setTime({days: '', hours: '00', minutes: '00', seconds: '00'});
            return;
        }
        let deadline:any = moment(countDownTime);

        let x = setInterval(() => {
            let currentTime:any = new Date().getTime();
            let eventTime:any = deadline - currentTime;

            let days:number = padStartNumber(Math.floor(eventTime / (1000 * 60 * 60 * 24)), 'days');
            let hours:number = padStartNumber(Math.floor((eventTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), '0');
            let minutes:number = padStartNumber(Math.floor((eventTime % (1000 * 60 * 60)) / (1000 * 60)), '0');
            let seconds:number = padStartNumber(Math.floor((eventTime % (1000 * 60)) / 1000), '0');

            setTime({days, hours, minutes, seconds});

            if (eventTime < 0) {
                clearInterval(x);
                setTime({days: '', hours: '00', minutes: '00', seconds: '00'});
            }
        }, 1000);

        return () => {
            clearInterval(x);
        }
    }, [countDownTime]);

    return time;
}

export default useCountDown;