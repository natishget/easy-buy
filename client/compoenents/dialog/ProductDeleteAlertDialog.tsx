import React, { useState } from "react";

import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { deleteProductAsync } from "@/state/API/ApiSlice";

const ProductDeleteAlertDialog = ({ productId }: { productId: number }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await dispatch(deleteProductAsync({ id: productId })).unwrap();
    } catch (error) {
      console.error("Failed to delete the product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Trash2 />
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Delete Product</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure? You want to delete this Product permanently? Remember
          Deleting the product also remove order tied to the product!!
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={handleDelete}>
              yes, delete it
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default ProductDeleteAlertDialog;
