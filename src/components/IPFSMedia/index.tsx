/*
	This container...
	- gets the media that we need from IPFS
	- finds out what file type we are rendering
	- creates a Blob url to send to presentational layer 
		from data return from IPFS
*/

import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import { MediaContainerProps } from './types';

import { Spinner } from 'components';

import IPFSMedia from './IPFSMedia';

enum MediaType {
	Image,
	Video,
}

const IPFSMediaContainer = (props: MediaContainerProps) => {
	// Destructure props
	const { className, style, alt, ipfsUrl } = props;

	const [isLoading, setIsLoading] = useState<boolean>();
	const [blobUrl, setBlobUrl] = useState<string | undefined>();
	const [mediaType, setMediaType] = useState<MediaType | undefined>();

	const getMediaType = (typeFromBlob: string) => {
		if (typeFromBlob.indexOf('image') > -1) {
			return MediaType.Image;
		} else if (typeFromBlob.indexOf('video') > -1) {
			return MediaType.Video;
		} else {
			return undefined;
		}
	};

	useEffect(() => {
		setIsLoading(true);
		if (!ipfsUrl || ipfsUrl.length === 0) {
			return;
		}
		fetch(ipfsUrl)
			.then((r: Response) => {
				if (r.status === 200) {
					return r.blob();
				} else {
					throw 'Failed to retrieve media data at ' + ipfsUrl;
				}
			})
			.then((mediaBlob: Blob) => {
				setIsLoading(false);
				const type = getMediaType(mediaBlob.type);
				if (!type) {
					throw 'Invalid media type ' + mediaBlob.type;
				}
				const url = URL.createObjectURL(mediaBlob);
				if (!url) {
					throw 'Failed to create blob url';
				}
				setMediaType(type);
				setBlobUrl(url);
			})
			.catch((e: any) => {
				console.error(e);
				setIsLoading(false);
			});
	}, [ipfsUrl]);

	if (isLoading) return <Spinner />;
	else return <>loaded</>;
};

export default IPFSMediaContainer;
