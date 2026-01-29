import { useState, ChangeEvent, FormEvent } from "react";
import {
  useCreateStickerTagMutation,
  useListStickerTagsQuery,
  useUpdateStickerTagMutation,
  useDeleteStickerTagMutation,
} from "@/redux-store/services/stickerGarageApi";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Loader2, Pencil, Trash2 } from "lucide-react";

interface FormState {
  tagName: string;
  description: string;
  stickerType: "STATIC" | "DYNAMIC";
  priceWithoutToken: string;
  isCustomizable: boolean;
  status: "ACTIVE" | "INACTIVE";
}

const initialState: FormState = {
  tagName: "",
  description: "",
  stickerType: "STATIC",
  priceWithoutToken: "",
  isCustomizable: false,
  status: "ACTIVE",
};

const AdminCreateTags = () => {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [createStickerTag, { isLoading: isCreating }] =
    useCreateStickerTagMutation();
  const [updateStickerTag, { isLoading: isUpdating }] =
    useUpdateStickerTagMutation();
  const [deleteStickerTag] = useDeleteStickerTagMutation();
  const { data: tagList, isFetching, refetch } = useListStickerTagsQuery();

  const isLoading = isCreating || isUpdating;
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    setFormError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.tagName.trim()) {
      setFormError("Tag name is required");
      return;
    }
    if (
      !formData.priceWithoutToken ||
      isNaN(Number(formData.priceWithoutToken))
    ) {
      setFormError("Valid price is required");
      return;
    }

    try {
      if (editingId) {
        await deleteStickerTag(editingId).unwrap();
        await updateStickerTag({
          id: editingId,
          data: {
            tagName: formData.tagName.trim().toUpperCase(),
            description: formData.description.trim() || undefined,
            stickerType: formData.stickerType,
            priceWithoutToken: Number(formData.priceWithoutToken),
            isCustomizable: formData.isCustomizable,
            status: formData.status,
          },
        }).unwrap();
        toast.success("Sticker tag updated successfully");
      } else {
        await createStickerTag({
          tagName: formData.tagName.trim().toUpperCase(),
          description: formData.description.trim() || undefined,
          stickerType: formData.stickerType,
          priceWithoutToken: Number(formData.priceWithoutToken),
          isCustomizable: formData.isCustomizable,
          status: formData.status,
        }).unwrap();
        toast.success("Sticker tag created successfully");
      }

      setFormData(initialState);
      setEditingId(null);
      refetch();
    } catch (err: any) {
      const message =
        err?.data?.message || err?.message || "Failed to create tag";
      toast.error(message);
    }
  };

  const startEdit = (tag: any) => {
    setFormData({
      tagName: tag.tagName,
      description: tag.description || "",
      stickerType: tag.stickerType,
      priceWithoutToken: tag.priceWithoutToken.toString(),
      isCustomizable: tag.isCustomizable,
      status: tag.status,
    });
    setEditingId(tag._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStickerTag(id).unwrap();
      toast.success("Sticker tag deleted successfully");
      refetch();
    } catch (err: any) {
      const message =
        err?.data?.message || err?.message || "Failed to delete tag";
      toast.error(message);
    }
  };

  return (
    <div className='min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Form Section */}
        <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8'>
          <h2 className='text-2xl font-bold text-white mb-6'>
            Create Sticker Tags
          </h2>

          {formError && (
            <div className='mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm'>
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-2 gap-6'>
              {/* Left Column */}
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium mb-2 text-white'>
                    Tag Name
                  </label>
                  <input
                    name='tagName'
                    type='text'
                    value={formData.tagName}
                    onChange={handleChange}
                    disabled={isLoading}
                    className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium mb-2 text-white'>
                    Description
                  </label>
                  <textarea
                    name='description'
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    disabled={isLoading}
                    className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none'
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium mb-2 text-white'>
                    Sticker Type
                  </label>
                  <select
                    name='stickerType'
                    value={formData.stickerType}
                    onChange={handleChange}
                    disabled={isLoading}
                    className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400'
                  >
                    <option value='STATIC'>STATIC</option>
                    <option value='DYNAMIC'>DYNAMIC</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium mb-2 text-white'>
                    Status
                  </label>
                  <select
                    name='status'
                    value={formData.status}
                    onChange={handleChange}
                    disabled={isLoading}
                    className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400'
                  >
                    <option value='ACTIVE'>ACTIVE</option>
                    <option value='INACTIVE'>INACTIVE</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium mb-2 text-white'>
                    Price
                  </label>
                  <input
                    name='priceWithoutToken'
                    type='number'
                    step='0.01'
                    value={formData.priceWithoutToken}
                    onChange={handleChange}
                    disabled={isLoading}
                    className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400'
                  />
                </div>
              </div>
            </div>

            <div className='mt-6'>
              <Button
                type='submit'
                disabled={isLoading}
                className='w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white py-3'
              >
                {isLoading ? (
                  <span className='flex items-center gap-2'>
                    <Loader2 className='animate-spin' /> Creating...
                  </span>
                ) : editingId ? (
                  "Update Tag"
                ) : (
                  "Create Tag"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Cards Grid Section */}
        <div>
          <h3 className='text-xl font-semibold text-white mb-4'>
            Existing Tags
          </h3>
          {isFetching ? (
            <div className='flex items-center gap-2 text-white'>
              <Loader2 className='animate-spin' /> Loading...
            </div>
          ) : tagList && tagList.items.length ? (
            <div className='grid grid-cols-2 gap-6'>
              {tagList.items.map((tag: any) => (
                <div
                  key={tag._id}
                  className='bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors'
                >
                  <div className='flex items-start justify-between mb-4'>
                    <div>
                      <h4 className='text-lg font-semibold text-white mb-1'>
                        {tag.tagName}
                      </h4>
                      <p className='text-sm text-white/60'>{tag.stickerType}</p>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        size='icon'
                        variant='ghost'
                        onClick={() => startEdit(tag)}
                        className='text-white hover:bg-white/10'
                      >
                        <Pencil className='size-4' />
                      </Button>
                      <Button
                        size='icon'
                        variant='ghost'
                        onClick={() => handleDelete(tag._id)}
                        className='text-red-400 hover:bg-red-500/10'
                      >
                        <Trash2 className='size-4' />
                      </Button>
                    </div>
                  </div>
                  <div className='space-y-2 text-sm'>
                    <p className='text-white/80'>
                      <span className='text-white/60'>Description:</span>{" "}
                      {tag.description || "—"}
                    </p>
                    <p className='text-white/80'>
                      <span className='text-white/60'>Price:</span> ₹
                      {tag.priceWithoutToken}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-white/60'>No sticker tags found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCreateTags;
