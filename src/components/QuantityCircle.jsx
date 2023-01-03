import { CheckOutline } from "antd-mobile-icons";
import classNames from "classnames";

const QuantityCircle = ({ quantity, onClick }) => (
  <button
    type="button"
    className={classNames("quantityCircle", {
      quantityCircleChecked: quantity === 0,
    })}
    onClick={onClick}
  >
    {quantity > 0 ? `x${quantity}` : <CheckOutline />}
  </button>
);

export default QuantityCircle;
