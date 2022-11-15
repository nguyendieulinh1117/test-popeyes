import { date } from "yup";

export type ResponseApi<T> = {
    response: T;
    isLoading?: boolean;
};

export type RequestApi<T> = {
    payload: T;
    type: Action;
};

export type PayloadType = {
    params: any;
    onCompleted: () => void;
    onError: (error: any) => void;
};

export type Action = {
    type: string;
};

export type Collection = {
    id: number;
    collectionName: string;
    createDate: Date;
    folderName: string;
    coverImage: string;
    images: string[];
};

export type Banner = {
    id: number;
    title: string;
    imageUrl: string;
    mobileImageUrl: string;
    mobileAppImageUrl: string;
    linkUrl: string;
    deepLink: string;
    order: number;
    bannerType: BannerType;
    approve: number;
};

export type BannerType = {
    id: number;
    name: string;
    imageAspect: string;
    mobileImageAspect: string;
    approve: boolean;
};

export type ContentType = {
    approve?: boolean;
    blogContent?: string;
    contentCategory?: ContentCategory;
    id?: number;
    imageUrl?: string;
    mobileImageCoverUrl?: string;
    mobileImageUrl?: string;
    order?: number;
    promotion?: any;
    promotionCode?: string;
    slug?: string;
    summary?: string;
    title?: string;
    updatedTime?: string;
};

export type ContentEvent = {
    title: string;
    disabledTitle: string;
    linkUrl: string;
    deepLink: string;
};
export type ContentCategory = {
    id: number;
    name: string;
    hasEvent: boolean;
};
