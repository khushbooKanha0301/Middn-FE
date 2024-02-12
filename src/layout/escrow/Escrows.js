import { useParams} from "react-router-dom";
import EscrowPay from "./EscrowPay";
import EscrowSeller from "./EscrowSeller";

export const Escrows= () => {
    const { id } = useParams();
 console.log("id ", id);
   
    return (
        <>
            {(id !== null || id !== undefined) && (id && id.length > 24) 
            ?  <EscrowSeller />
            : <EscrowPay />}
        </>
    );
  };
  
  export default Escrows;