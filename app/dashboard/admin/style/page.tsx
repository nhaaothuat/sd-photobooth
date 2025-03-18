"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Text,
  ScrollArea,
  Group,
  Image,
} from "@mantine/core";
import AxiosAPI from "@/configs/axios";
import SearchInput from "@/components/component/SearchInput";
import cx from "clsx";
import AddPhotoStyle from "@/components/component/AddPhotoStyle";
import DeleteStyle from "@/components/component/DeleteStyle";
import DeletePayment from "@/components/component/DeletePayment";
import { toast } from "react-toastify";
import GPPhotoStyle from "@/components/component/GPPhotoStyle";
import IDPhotoStyle from "@/components/component/IDPhotoStyle";

interface PhotoStyle {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

const PhotoStyle = () => {
  const [photoStyles, setPhotoStyles] = useState<PhotoStyle[]>([]);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const fetchPhotoStyles = async () => {
    try {
      const response = await AxiosAPI.get<PhotoStyle[]>(
        "api/PhotoStyle"
      );
      setPhotoStyles(response.data ?? []);
    } catch (err) {
      console.error("Error fetching photo styles:", err);
    }
  };

  useEffect(() => {
    fetchPhotoStyles();
  }, []);

  const filteredData = photoStyles.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {


    try {
      await AxiosAPI.delete(`api/PhotoStyle/${id}`);

      toast.dismiss();
      toast.success(`Payment method deleted successfully!`)
      fetchPhotoStyles();
    } catch (err: any) {
      console.error("Delete Error:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };


  return (
    <div className="space-y-4 p-6">
      <div className='flex items-center justify-between'>
        <h2 className="text-xl font-bold">Danh sách phương thức thanh toán</h2>
        <AddPhotoStyle onAddSuccess={fetchPhotoStyles} />
      </div>
      <SearchInput search={search} onSearchChange={(e) => setSearch(e.currentTarget.value)} />
      <ScrollArea
        h={450}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
        scrollbarSize={6}
        scrollHideDelay={0}
      >
        <Table
          striped
          withTableBorder
          withColumnBorders
          horizontalSpacing="md"
          verticalSpacing="xs"
          miw={700}
          layout="fixed"
        >
          <Table.Thead
            className={cx("sticky top-0 bg-white dark:bg-gray-900 transition-shadow", {
              "shadow-md": scrolled,
            })}
          >
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Image</Table.Th>
              <Table.Th>Created At</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredData.length > 0 ? (
              filteredData.map((style) => (
                <Table.Tr key={style.id}>
                  <Table.Td>{style.id}</Table.Td>
                  <Table.Td>
                    <Text fz="sm" fw={500}>{style.name}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text fz="xs" c="dimmed">{style.description}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Image src={style.imageUrl} alt={style.name} width={50} height={50} radius="md" />
                  </Table.Td>
                  <Table.Td>{new Date(style.createdAt).toLocaleDateString()}</Table.Td>
                  <Table.Td >
                    <Group gap="sm">
                      <DeletePayment id={style.id} onDelete={handleDelete} />
                      <GPPhotoStyle id={style.id} photoStyleData={style} onUpdateSuccess={fetchPhotoStyles} />
                      <IDPhotoStyle id={style.id} />
                    </Group>


                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5} align="center">
                  <Text fw={500} ta="center">Không có dữ liệu</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default PhotoStyle;
