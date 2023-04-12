import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AutoCenter,
  Form,
  Input,
  Button,
  SpinLoading,
  Picker,
  Stepper,
} from "antd-mobile";
import { NavBar } from "../components";
import { getItem, getCategories, addItem, updateItem } from "../db";

const initialValues = {
  task: "",
  tag: "Cualquiera",
  quantity: 1,
};

const Item = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState();
  const [categories, setCategories] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  function handleOnBack() {
    navigate(-1);
  }

  async function handleOnSubmit() {
    const values = form.getFieldsValue();
    if (itemId) await updateItem(itemId, values);
    else await addItem(values);
    handleOnBack();
  }

  async function handleGetData() {
    if (itemId) {
      const itemData = await getItem(itemId);
      setItem(itemData);
    } else {
      setItem(initialValues);
    }

    const data = await getCategories();
    setCategories(
      data.map(({ name: label, id: value }) => ({
        label,
        value,
      }))
    );
  }

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <>
      <NavBar onBack={handleOnBack}>ShopList</NavBar>
      {!item && (
        <AutoCenter style={{ padding: "25px 0px" }}>
          <SpinLoading color="primary" />
        </AutoCenter>
      )}
      {item && (
        <Form
          form={form}
          initialValues={{
            ...item,
          }}
          layout="horizontal"
          footer={
            <>
              <Button
                block
                type="submit"
                color="primary"
                size="large"
                style={{ marginBottom: "8px" }}
                onClick={handleOnSubmit}
              >
                Guardar
              </Button>
              <Button
                block
                type="button"
                color="default"
                size="large"
                onClick={handleOnBack}
              >
                Cancelar
              </Button>
            </>
          }
        >
          <Form.Header>
            {itemId ? "Editar producto" : "Crear producto"}
          </Form.Header>
          <Form.Item name="task" label="Nombre" rules={[{ required: true }]}>
            <Input placeholder="Nombre del producto" />
          </Form.Item>
          <Form.Item
            name="tag"
            label="¿Dónde comprar?"
            rules={[{ required: true }]}
            shouldUpdate={(prev, next) => prev.tag !== next.tag}
          >
            <Input
              placeholder="Dónde comprar el producto"
              onClick={() => setShowPicker(true)}
              value={form.getFieldValue("tag")}
              onKeyDown={(e) => e.preventDefault()}
              inputMode="none"
            />
          </Form.Item>
          <Picker
            columns={[categories]}
            visible={showPicker}
            confirmText="Aceptar"
            cancelText="Cancelar"
            onClose={() => {
              setShowPicker(false);
            }}
            onConfirm={(values) => {
              form.setFieldValue(
                "tag",
                categories.find((c) => c.value === values[0])?.label
              );
            }}
          />
          <Form.Item
            name="quantity"
            label="Cantidad"
            childElementPosition="right"
          >
            <Stepper min={0} />
          </Form.Item>
        </Form>
      )}
    </>
  );
};

export default Item;
