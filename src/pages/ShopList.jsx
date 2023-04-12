import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import {
  List,
  SwipeAction,
  SpinLoading,
  ErrorBlock,
  AutoCenter,
  PullToRefresh,
  FloatingBubble,
  SearchBar,
  Dialog,
} from "antd-mobile";
import {
  EditSOutline,
  DeleteOutline,
  CheckOutline,
  AddOutline,
} from "antd-mobile-icons";
import { collections, db, updateItem, removeItem } from "../db";
import { QuantityCircle, SwipeButton } from "../components";

const ShopList = ({ toBuyOnly = false, searchMode = false }) => {
  let unsubscribe = undefined;
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef();
  const navigate = useNavigate();
  const searchExists = () =>
    searchMode && search !== undefined && search.trim() !== "";

  const leftActions = [
    {
      key: "editItem",
      text: <SwipeButton icon={<EditSOutline />} text="Editar" />,
      color: "primary",
    },
    {
      key: "deleteItem",
      text: <SwipeButton icon={<DeleteOutline />} text="Eliminar" />,
      color: "danger",
    },
  ];

  const rightActions = [
    {
      key: "checkItem",
      text: (
        <SwipeButton
          icon={toBuyOnly ? <CheckOutline /> : <AddOutline />}
          text={toBuyOnly ? "¡Comprado!" : "Añadir"}
        />
      ),
      color: "success",
    },
  ];

  const swipeActions = {
    editItem: (itemId) => {
      navigate(`/shoplist/items/${itemId}`);
    },
    deleteItem: (itemId) => {
      Dialog.confirm({
        title: "Eliminar producto",
        content: "¿Seguro que quieres eliminar el producto seleccionado?",
        confirmText: "Eliminar",
        cancelText: "Cancelar",
        onConfirm: () => removeItem(itemId),
      });
    },
    checkItem: (itemId) => {
      updateItem(itemId, { quantity: toBuyOnly ? 0 : 1 });
    },
  };

  function handleSwipeAction(actionName, itemId) {
    if (!(actionName in swipeActions)) return;
    swipeActions[actionName](itemId);
  }

  function handleAddQuantity({ id, quantity }) {
    updateItem(id, { quantity: quantity + 1 });
  }

  function handleSubtractQuantity({ id, quantity }) {
    if (quantity <= 0) return;
    updateItem(id, { quantity: quantity - 1 });
  }

  function handleGetItems() {
    unsubscribe?.();
    setIsLoading(true);
    const q = toBuyOnly
      ? query(collection(db, collections.todo), where("quantity", ">", 0))
      : query(collection(db, collections.todo));
    unsubscribe = onSnapshot(q, (snapshot) => {
      const itemList = [];
      snapshot.forEach((doc) => itemList.push({ ...doc.data(), id: doc.id }));
      setItems(
        itemList.sort(
          (a, b) => (a.task > b.task ? 1 : b.task > a.task ? -1 : 0)
        )
      );
      setIsLoading(false);
    });
  }

  function handleNewItem() {
    navigate("/shoplist/new");
  }

  function handleOnSearch(query) {
    setTimeout(() => {
      setSearch(query.toLowerCase());
    }, 500);
  }

  useEffect(() => {
    handleGetItems();
    return () => unsubscribe?.();
  }, [toBuyOnly]);

  useEffect(() => {
    if (searchMode) {
      searchRef.current?.focus();
    }
  }, [searchMode, items]);

  return (
    <>
      <PullToRefresh
        onRefresh={handleGetItems}
        renderText={() => "Suelta para recargar..."}
      >
        {isLoading && (
          <AutoCenter style={{ padding: "25px 0px" }}>
            <SpinLoading color="primary" />
          </AutoCenter>
        )}
        {searchMode && !isLoading && (
          <div className="search">
            <SearchBar
              ref={searchRef}
              placeholder="Buscar productos..."
              onChange={handleOnSearch}
              clearable
            />
          </div>
        )}
        {!isLoading && !items.length && (
          <ErrorBlock
            status="empty"
            title="La lista está vacía"
            description={
              toBuyOnly ? "No hay productos para comprar" : "No hay productos"
            }
          />
        )}
        {!isLoading && items.length > 0 && (
          <List style={{ "--border-top": "none" }}>
            {items
              .filter(
                (item) =>
                  !searchExists() || item.taskLower?.indexOf(search) > -1
              )
              .map((item) => (
                <SwipeAction
                  key={item.id}
                  leftActions={leftActions}
                  rightActions={rightActions}
                  onAction={(action) => handleSwipeAction(action.key, item.id)}
                >
                  <List.Item
                    prefix={
                      <QuantityCircle
                        quantity={item.quantity}
                        onClick={() => handleSubtractQuantity(item)}
                      />
                    }
                    description={item.tag}
                  >
                    <div onClick={() => handleAddQuantity(item)}>
                      {item.task}
                    </div>
                  </List.Item>
                </SwipeAction>
              ))}
          </List>
        )}
      </PullToRefresh>
      <FloatingBubble
        style={{
          "--initial-position-bottom": "24px",
          "--initial-position-right": "24px",
          "--edge-distance": "24px",
        }}
        onClick={handleNewItem}
      >
        <AddOutline fontSize={32} />
      </FloatingBubble>
    </>
  );
};

export default ShopList;
