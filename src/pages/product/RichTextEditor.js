import React, { Component } from 'react'

// 用来指定商品详情的富文本编辑器
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';




export default class RichTextEditor extends Component {
    constructor(props) {
        super(props);
        const html = this.props.detail
        if (html) {//如果有值 会根据html标签 创建对应的编辑文本
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.state = {
                    editorState,
                };
            }
        } else {
            this.state = {
                //   创建空的 没有内容的 编辑对象
                editorState: EditorState.createEmpty(),
            }
        }
    }
    state = {
        //   创建空的 没有内容的 编辑对象
        editorState: EditorState.createEmpty(),
    }

    //   输入过程的监听
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    getDetail = () => {
        //获取到 输入框中 对应的标签格式的文本
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    // 选择上传图片
    uploadImageCallBack = (file) => {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/manage/img/upload');
                const data = new FormData();
                data.append('image', file);
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText);
                    const url = response.data.url//拿到图片的地址url
                    resolve({ data: { link: url } });
                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            }
        );
    }

    render() {
        const { editorState } = this.state;
        return (
            <div>
                <Editor
                    editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorStyle={{ border: '1px solid #ccc', height: 300, padding: 15 }}
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{
                        //    支持选择图片上传的形式
                        image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                    }}
                />
                {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
            </div>
        );
    }
}