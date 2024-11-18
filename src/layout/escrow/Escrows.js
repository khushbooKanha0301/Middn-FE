import { useEffect , useState} from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import jwtAxios from "../../service/jwtAxios";
import { userDetails } from "../../store/slices/AuthSlice";
import EscrowBuyer from "../../layout/escrow/EscrowBuySell";
import EscrowSeller from "../../layout/escrow/EscrowSeller";
import { useNavigate } from "react-router-dom";

export const Escrows = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const { state } = location;
    const key = state?.key
   
    const acAddress = useSelector(userDetails);
    const [isSeller, setIsSeller] = useState(false);
    const [isBuyer, setIsBuyer] = useState(false);
    const [escrowLoading, setEscrowLoading] = useState(false); 
    
    useEffect(() => {
        if (acAddress?.account === "Connect Wallet") {
            navigate("/");
          } else if (acAddress.account !==  "Connect Wallet"  && id != null) {
            jwtAxios
              .get(`/trade/getTradeByEscrow/${id}`)
              .then((res) => {
                if (res.data?.data) {
                  if(acAddress.account === res.data?.data?.user_address || acAddress.account === res.data?.data?.trade_address){
                    setIsSeller(true);
                    setEscrowLoading(true);
                  } else {
                    navigate("/");
                  }
                 
                } else {
                  setIsBuyer(true);
                  setEscrowLoading(true);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
    }, [acAddress, id]);

    return (
        <>
            {acAddress && (
                <>
                    {escrowLoading  && (isSeller || (key === 'notification')) && <EscrowSeller id={id} />}
                    {escrowLoading  && (isBuyer ) && <EscrowBuyer id={id} />}
                </>
            )}
        </>
    );
}

export default Escrows;