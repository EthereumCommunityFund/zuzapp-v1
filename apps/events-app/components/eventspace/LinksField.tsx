import { RxMinus, RxPlus } from 'react-icons/rx';
import IconButton from '../ui/buttons/IconButton';
import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputFieldDark from '../ui/inputFieldDark';
import { InputFieldType } from '@/types';
import { v4 } from 'uuid';
import { GoXCircle } from 'react-icons/go';

type TagItemProp = {
  name: string;
  link: string;
};

interface IProps {
  socialLinks: TagItemProp[];
  extraLinks: TagItemProp[];
  setSocialLinks: any;
  setExtraLinks: any;
}

export default function LinkField({ socialLinks, extraLinks, setSocialLinks, setExtraLinks }: IProps) {
  //   const { linkType, setFormData, formData } = props;
  const [isLink, setIsLink] = useState(false);
  const [otherLinks, setOtherLinks] = useState(false);
  const [tagItem, setTagItem] = useState({ name: '', link: '' });
  const [otherItem, setOtherItem] = useState({ name: '', link: '' });

  const mediaLinks = [{ name: 'Facebook' }, { name: 'Twitter' }, { name: 'Instagram' }, { name: 'LinkedIn' }, { name: 'Youtube' }];
  const extras = [{ name: 'Discord' }, { name: 'Telegram' }, { name: 'Website' }, { name: 'Blog' }];

  const defaultProps = {
    options: mediaLinks,
    getOptionLabel: (option: { name: string }) => option.name,
  };

  const otherProps = {
    options: extras,
    getOptionLabel: (option: { name: string }) => option.name,
  };

  const handleRemoveTagItem = (index: number) => {
    const updatedItems = [...socialLinks.slice(0, index), ...socialLinks.slice(index + 1)];
    setSocialLinks(updatedItems);
  };
  const handleRemoveOtherItem = (index: number) => {
    const updatedItems = [...extraLinks.slice(0, index), ...extraLinks.slice(index + 1)];
    setExtraLinks(updatedItems);
  };

  useEffect(() => {
    if (socialLinks.length > 0) {
      setIsLink(true);
    }
  }, [socialLinks]);

  useEffect(() => {
    if (extraLinks.length > 0) {
      setOtherLinks(true);
    }
  }, [extraLinks]);

  return (
    <div className="flex flex-col gap-5">
      <div className="">
        <div className="flex space-x-3 items-center">
          <div className="font-semibold text-base leading-[19.px] flex ">Social Links</div>
          {isLink ? (
            <IconButton variant="dark" className="rounded-full" icon={RxMinus} onClick={() => setIsLink(!isLink)}></IconButton>
          ) : (
            <IconButton variant="dark" className="rounded-full" icon={RxPlus} onClick={() => setIsLink(!isLink)}></IconButton>
          )}
          {/* <IconButton variant="dark" className="rounded-full" icon={RxPlus} onClick={() => setIsLink(!isLink)}></IconButton> */}
        </div>
        {isLink && (
          <div className="flex flex-col gap-5 justify-between mt-2">
            <div className="flex w-full text-white space-x-3 items-center">
              <div className="flex w-full text-white outline-none rounded-lg pr-3 pl-2.5 bg-inputField gap-2.5 border border-white/10 border-opacity-10 items-center">
                <Autocomplete
                  {...defaultProps}
                  id="controlled-demo"
                  sx={{ color: 'black', width: '100%' }}
                  value={tagItem}
                  onChange={(event: any, newValue) => {
                    if (newValue) {
                      setTagItem({ ...tagItem, name: newValue.name });
                    }
                  }}
                  onInputChange={(event, newInputValue) => {
                    setTagItem({ ...tagItem, name: newInputValue });
                  }}
                  slotProps={{
                    paper: {
                      sx: {
                        color: 'white',
                        backgroundColor: '#242727',
                      },
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      sx={{
                        color: 'white',
                        input: {
                          color: 'white',
                        },
                        label: {
                          color: 'white',
                        },
                      }}
                      {...params}
                      label="social media"
                      variant="standard"
                    />
                  )}
                />
              </div>
              <InputFieldDark
                type={InputFieldType.Link}
                placeholder="Type URL"
                value={tagItem.link}
                onChange={(e) =>
                  setTagItem({
                    ...tagItem,
                    link: (e.target as HTMLInputElement).value,
                  })
                }
              />
              <div>
                <IconButton
                  variant="dark"
                  className="rounded-full"
                  icon={RxPlus}
                  onClick={() => {
                    if (tagItem.link === '' || tagItem.name === '') return;
                    setSocialLinks([...socialLinks, tagItem]);
                    setTagItem({ name: '', link: '' });
                  }}
                ></IconButton>
              </div>
            </div>
            <div className="flex items-start flex-wrap gap-2.5">
              {socialLinks?.map((item, index) => {
                const id = v4();
                return (
                  <div key={id} className="flex gap-2.5 items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10">
                    <button className="flex gap-2.5 items-center">
                      <GoXCircle onClick={() => handleRemoveTagItem(index)} className="top-0.5 left-0.5 w-4 h-4" />
                      <span className="text-sm font-semibold leading-[1.2] text-white self-stretch">
                        {item.name} - {item.link}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="">
        <div className="flex space-x-3 items-center">
          <div className="font-semibold text-base leading-[19.px] flex ">Extra Links</div>
          {otherLinks ? (
            <IconButton variant="dark" className="rounded-full" icon={RxMinus} onClick={() => setOtherLinks(!otherLinks)}></IconButton>
          ) : (
            <IconButton variant="dark" className="rounded-full" icon={RxPlus} onClick={() => setOtherLinks(!otherLinks)}></IconButton>
          )}
        </div>
        {otherLinks && (
          <div className="flex flex-col gap-5 justify-between mt-2">
            <div className="flex w-full text-white space-x-3 items-center">
              <div className="flex w-full text-white outline-none rounded-lg pr-3 pl-2.5 bg-inputField gap-2.5 border border-white/10 border-opacity-10 items-center">
                <Autocomplete
                  {...otherProps}
                  id="controlled-demo"
                  sx={{ color: 'white', width: '100%' }}
                  value={otherItem}
                  onChange={(event: any, newValue) => {
                    if (newValue) {
                      setOtherItem({ ...otherItem, name: newValue.name });
                    }
                  }}
                  onInputChange={(event, newInputValue) => {
                    setOtherItem({ ...otherItem, name: newInputValue });
                  }}
                  slotProps={{
                    paper: {
                      sx: {
                        color: 'white',
                        backgroundColor: '#242727',
                      },
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      sx={{
                        color: 'white',
                        input: {
                          color: 'white',
                        },
                        label: {
                          color: 'white',
                        },
                      }}
                      {...params}
                      label="other links"
                      variant="standard"
                    />
                  )}
                />
              </div>
              <InputFieldDark
                type={InputFieldType.Link}
                placeholder="Type URL"
                value={otherItem.link}
                onChange={(e) =>
                  setOtherItem({
                    ...otherItem,
                    link: (e.target as HTMLInputElement).value,
                  })
                }
              />
              <div>
                <IconButton
                  variant="dark"
                  className="rounded-full"
                  icon={RxPlus}
                  onClick={() => {
                    if (otherItem.link === '' || otherItem.name === '') return;
                    setExtraLinks([...extraLinks, otherItem]);
                    setOtherItem({ name: '', link: '' });
                  }}
                ></IconButton>
              </div>
            </div>
            <div className="flex items-start flex-wrap gap-2.5">
              {extraLinks?.map((item, index) => {
                const id = v4();
                return (
                  <div key={id} className="flex gap-2.5 items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10">
                    <button className="flex gap-2.5 items-center">
                      <GoXCircle onClick={() => handleRemoveOtherItem(index)} className="top-0.5 left-0.5 w-4 h-4" />
                      <span className="text-sm font-semibold leading-[1.2] text-white self-stretch">
                        {item.name} - {item.link}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
