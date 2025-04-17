import { useEffect, useState } from "react";
import { userDashboardCardsConst } from "../../utils/constants"
import ProgressCounter from "../common/ProgressCounter"
import { IQuotes } from "../../types";
import { getQuotes } from "../../services/quoteService";

const UserDashboardCards = () => {
    const [quotes, setQuotes] = useState<IQuotes[]>([]);
    const [loading, setLoading] = useState(true);

    const quotesArray = Array.isArray(quotes) ? quotes : [quotes];

    const handleProgress = (score: number) => {
        if (score > 75) {
            return <h3 className="text-green-500 text-left">| Excellent</h3>
        }
        else if (score > 50) {
            return <h3 className="text-yellow-500 text-left">| Good</h3>
        }
        else {
            return <h3 className="text-red-500 text-left">| Poor</h3>
        }
    }

    useEffect(() => {
        const fetchQuotes = async () => {
            const data = await getQuotes();
            setQuotes(data);
            setLoading(false);
        };
        const interval = setInterval(fetchQuotes, 10000);
        fetchQuotes();

        return () => clearInterval(interval);
    }, []);
    return (
        <>
            <div className="flex flex-row justify-between mt-10">
                <div
                    className="bg-white rounded-lg shadow-md p-4 flex flex-row items-center transition-all duration-300 hover:shadow-lg hover:scale-105 w-1/3 flex-wrap"
                >
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col">
                            <h3 className="text-lg font-semibold mb-2">Task Assigned</h3>
                            <div className="text-2xl font-bold text-blue-600">
                                89<span className="text-xs text-gray-500 ml-1">/ 100</span>
                            </div>
                        </div>
                        <div className="text-3xl">
                            <ProgressCounter progress={89} size={100} />
                        </div>
                    </div>
                    <div className="text-lg">{handleProgress(89)}</div>
                </div>
            </div>
            <div className="flex flex-row justify-between mt-10">
                {userDashboardCardsConst.map((card, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md py-4 px-6 flex flex-col items-center transition-all duration-300 hover:shadow-lg hover:scale-105"
                        style={{ width: '200px', height: '208px' }}
                    >
                        <div className="text-3xl mb-4">
                            {<card.icon className="text-blue-500" />}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                        <div className="text-2xl font-bold text-blue-600">
                            {card.score}
                            <span className="text-xs text-gray-500 ml-1">/ {card.totalScore}</span>
                        </div>
                        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${(card.score / card.totalScore) * 100}%` }}
                            ></div>
                        </div>
                        <div className="text-lg mt-5">{handleProgress(card.score)}</div>
                    </div>
                ))}
            </div>
            {
                !loading && 
                <div className="mt-10 bg-white rounded-lg shadow-md p-4 flex flex-col transition-all duration-300 hover:shadow-lg w-full">
                    <h1 className="text-2xl font-bold mb-2">Quote of the day</h1>
                    <h3 className="text-sm font-semibold mb-2"> {quotesArray[0]?.quote}</h3>
                    <h3 className="text-sm font-semibold mb-2">  {quotesArray[0]?.author}</h3>
                </div>
            }
        </>
    )
}

export default UserDashboardCards

